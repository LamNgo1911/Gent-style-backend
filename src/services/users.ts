import nodemailer from "nodemailer";
import { FilterQuery } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

import { NotFoundError, ConflictError } from "../errors/ApiError";
import { User, UserToRegister } from "../misc/types";
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
  const user = await User.findOne({ resetToken });

  if (!user) {
    throw new NotFoundError(`User Not Found with ${resetToken}`);
  }

  return user;
};

// Todo: Update password
const updatePassword = async (
  user: User,
  newPassword: string
): Promise<User> => {
  user.password = newPassword;
  user.resetToken = null;
  user.resetTokenExpiresAt = null;

  await user.save();

  return user;
};

// Todo: Get all users
const getAllUsers = async function getUsers(
  query: FilterQuery<User>,
  sort: string,
  skip: number,
  limit: number
): Promise<User[]> {
  return await User.find(query).skip(skip).limit(limit).sort(sort).lean();
};

// Todo: Get a single user
const getSingleUser = async (id: string): Promise<User> => {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError(`User Not Found with ${id}`);
  }

  return user;
};

// Todo: Update a user
const updateUser = async (id: string, updateData: Partial<User>) => {
  const options = { new: true, runValidators: true };
  const updateUser = await User.findByIdAndUpdate(id, updateData, options);

  if (!updateUser) {
    throw new NotFoundError(`User Not Found with ${id}`);
  }

  return updateUser;
};

// Todo: Delete a user by admin
const deleteUser = async (id: string) => {
  const options = { new: true, runValidators: true };
  const user = await User.findByIdAndDelete(id, options);

  if (!user) {
    throw new NotFoundError(`User Not Found with ${id}`);
  }

  return user;
};

// Todo: Ban or unban a user by admin
const updateUserStatus = async (userId: string, status: string) => {
  const options = { new: true, runValidators: true };
  const user = await User.findByIdAndUpdate(userId, { status }, options);

  if (!user) {
    throw new NotFoundError(`User Not Found with ${userId}`);
  }

  return user;
};

// Todo: Find or create user
const findOrCreate = async (payload: Partial<User>) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    return user;
  } else {
    const user = new User({
      email: payload.email,
      password: payload.password,
      role: "user",
    });
    const createdUser = await user.save();
    return createdUser;
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
};
