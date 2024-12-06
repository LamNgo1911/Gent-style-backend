import nodemailer from "nodemailer";
import { FilterQuery } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

import { NotFoundError, ConflictError } from "../errors/ApiError";
import { Role, User, UserStatus, UserToRegister } from "../misc/types";
import { dynamoDB } from "../config/aws-dynamoDB";

// Todo: Create a new user
const createUser = async (userInput: UserToRegister): Promise<User> => {
  const { email } = userInput;
  const user = { ...userInput } as User;
  const isEmailAlreadyAdded = await getUserByEmail(email!);

  if (isEmailAlreadyAdded) {
    throw new ConflictError("Email already exists.");
  }

  user.userId = uuidv4();
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  user.createdAt = new Date().toISOString();
  user.updatedAt = new Date().toISOString();

  const params = {
    TableName: "Users",
    Item: user,
  };

  await dynamoDB.put(params).promise();
  return user as User;
};

// Todo: Get a user by email
const getUserByEmail = async (email: string): Promise<User> => {
  const params = {
    TableName: "Users",
    IndexName: "EmailIndex", // Assuming you have a secondary index on email
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  const result = await dynamoDB.query(params).promise();
  if (!result.Items) {
    throw new NotFoundError(`User Not Found with ${email}`);
  }

  const user = result.Items[0] as User;
  return user;
};

// Todo: Send verification email to user
const sendVerificationEmail = async (
  email: string,
  verificationLink: string
): Promise<any> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "lamngo606@gmail.com",
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: "lamngo606@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: ${verificationLink}`,
  };

  return await transporter.sendMail(mailOptions);
};

// Todo: Get reset password token
const getUserByResetToken = async (resetToken: string): Promise<User> => {
  const params = {
    TableName: "Users",
    IndexName: "ResetTokenIndex", // Assuming you have a secondary index on resetToken
    KeyConditionExpression: "resetToken = :resetToken",
    ExpressionAttributeValues: {
      ":resetToken": resetToken,
    },
  };

  const result = await dynamoDB.query(params).promise();
  if (!result.Items || result.Items.length === 0) {
    throw new NotFoundError(`User Not Found with ${resetToken}`);
  }

  return result.Items[0] as User;
};

// Todo: Update password
const updatePassword = async (
  userId: string,
  newPassword: string
): Promise<User> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updateExpression = `set password = :password`;
  const expressionAttributeValues: { [key: string]: any } = {
    ":password": hashedPassword,
  };

  // Use REMOVE clause to remove resetToken and resetTokenExpiresAt if they are null
  const removeExpression = `remove resetToken, resetTokenExpiresAt`;

  const params = {
    TableName: "Users",
    Key: { userId },
    UpdateExpression: `${updateExpression} ${removeExpression}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDB.update(params).promise();
  if (!result.Attributes) {
    throw new Error(`User Not Found with ${userId}`);
  }

  return result.Attributes as User;
};

// Todo: Get all users
const getAllUsers = async (
  limit: number,
  lastEvaluatedKey?: AWS.DynamoDB.DocumentClient.Key
): Promise<{
  users: User[];
  lastEvaluatedKey?: AWS.DynamoDB.DocumentClient.Key;
}> => {
  const params = {
    TableName: "Users",
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  const result = await dynamoDB.scan(params).promise();
  return {
    users: result.Items as User[],
    lastEvaluatedKey: result.LastEvaluatedKey,
  };
};

// Todo: Get a single user
const getSingleUser = async (userId: string): Promise<User> => {
  const params = {
    TableName: "Users",
    Key: { userId },
  };

  const result = await dynamoDB.get(params).promise();
  if (!result.Item) {
    throw new NotFoundError(`User Not Found with ${userId}`);
  }

  return result.Item as User;
};

// Todo: Update a user
const updateUser = async (
  userId: string,
  updateData: Partial<User>
): Promise<User> => {
  const updateExpressions = [];
  const expressionAttributeNames: { [key: string]: string } = {};
  const expressionAttributeValues: { [key: string]: any } = {};

  for (const key in updateData) {
    updateExpressions.push(`#${key} = :${key}`);
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = (updateData as any)[key];
  }

  const params = {
    TableName: "Users",
    Key: { userId },
    UpdateExpression: `set ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDB.update(params).promise();
  if (!result.Attributes) {
    throw new NotFoundError(`User Not Found with ${userId}`);
  }

  return result.Attributes as User;
};

// Todo: Update a user with reset token
const updateUserWithResetToken = async (
  userId: string,
  resetToken: string,
  resetTokenExpiresAt: string
): Promise<User> => {
  const params = {
    TableName: "Users",
    Key: { userId },
    UpdateExpression:
      "set resetToken = :resetToken, resetTokenExpiresAt = :resetTokenExpiresAt",
    ExpressionAttributeValues: {
      ":resetToken": resetToken,
      ":resetTokenExpiresAt": resetTokenExpiresAt,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDB.update(params).promise();
  if (!result.Attributes) {
    throw new NotFoundError(`User Not Found with ${userId}`);
  }

  return result.Attributes as User;
};

// Todo: Delete a user by admin
const deleteUser = async (userId: string): Promise<void> => {
  const params = {
    TableName: "Users",
    Key: { userId },
  };

  const result = await dynamoDB.delete(params).promise();
  if (!result.Attributes) {
    throw new NotFoundError(`User Not Found with ${userId}`);
  }
};

// Todo: Ban or unban a user by admin
const updateUserStatus = async (
  userId: string,
  status: string
): Promise<User> => {
  const params = {
    TableName: "Users",
    Key: { userId },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": status,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDB.update(params).promise();
  if (!result.Attributes) {
    throw new NotFoundError(`User Not Found with ${userId}`);
  }

  return result.Attributes as User;
};

// Todo: Find or create user
const findOrCreate = async (payload: Partial<User>): Promise<User> => {
  const existingUser = await getUserByEmail(payload.email!);
  if (existingUser) {
    return existingUser;
  } else {
    const newUser: User = {
      userId: uuidv4(),
      username: payload.username!,
      password: await bcrypt.hash(payload.password!, 10),
      email: payload.email!,
      role: Role.USER,
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orders: [],
      cartItems: [],
    };

    const params = {
      TableName: "Users",
      Item: newUser,
    };

    await dynamoDB.put(params).promise();
    return newUser;
  }
};

export default {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  sendVerificationEmail,
  updatePassword,
  getUserByResetToken,
  updateUserStatus,
  findOrCreate,
  updateUserWithResetToken,
};
