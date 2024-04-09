import nodemailer from "nodemailer";
import { FilterQuery, UpdateQuery } from "mongoose";

import User, { UserDocument } from "../models/User";
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
} from "../errors/ApiError";
import { UserStatus } from "../misc/types";

// Todo: Create a new user
const createUser = async (
  user: UserDocument
): Promise<UserDocument | string> => {
  const { email } = user;

  const isEmailAlreadyAdded = await User.findOne({ email });

  if (isEmailAlreadyAdded) {
    throw new ConflictError("Email already exists");
  }

  return await user.save();
};

// Todo: Get a user by email
const getUserByEmail = async (email: string): Promise<UserDocument> => {
  if (!email) {
    throw new BadRequestError(`Please enter your email!`);
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError(`Invalid credentials!`);
  }

  return user;
};

// Todo: Send verification email to user
const sendVerificationEmail = async (
  email: string,
  verificationLink: string
): Promise<any> => {
  if (!email) {
    throw new BadRequestError("Please provide your email");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "lamngo606@gmail.com",
      pass: "nlrpjsxylajeyhnp",
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
const getUserByResetToken = async (
  resetToken: string
): Promise<UserDocument> => {
  if (!resetToken) {
    throw new BadRequestError(`Please provide resetToken`);
  }

  const user = await User.findOne({ resetToken });

  if (!user) {
    throw new NotFoundError(`User Not Found with ${resetToken}`);
  }

  return user;
};

// Todo: Update password
const updatePassword = async (
  user: UserDocument,
  newPassword: string
): Promise<UserDocument> => {
  user.password = newPassword;
  user.resetToken = null;
  user.resetTokenExpiresAt = null;

  await user.save();

  return user;
};

// Todo: Get all users
const getAllUser = async function getUsers(
  query: FilterQuery<UserDocument>,
  sort: string,
  skip: number,
  limit: number
): Promise<UserDocument[]> {
  return await User.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean()
    .populate("orders");
};

// Todo: Get a single user
const getSingleUser = async (id: string): Promise<UserDocument> => {
  if (!id) {
    throw new BadRequestError("Please provide userId!");
  }
  const user = await User.findById(id);

  if (user) {
    return user;
  }

  throw new NotFoundError(`User Not Found with ${id}`);
};

// Todo: Update a user
const updateUser = async (id: string, updateData: Partial<UserDocument>) => {
  if (!id) {
    throw new BadRequestError("Please provide userId!");
  }

  const options = { new: true, runValidators: true };
  const updateUser = await User.findByIdAndUpdate(id, updateData, options);

  if (!updateUser) {
    throw new NotFoundError(`User Not Found with ${id}`);
  }

  return updateUser;
};

// Todo: Delete a user by admin
const deleteUser = async (id: string) => {
  if (!id) {
    throw new BadRequestError("Please provide userId!");
  }

  const options = { new: true, runValidators: true };
  const user = await User.findByIdAndDelete(id, options);

  if (user) {
    return user;
  }
  throw new NotFoundError(`User Not Found with ${id}`);
};

// const assingAdmin = async (id: string, updateRole: Partial<UserDocument>) => {
//   if (!id) {
//     throw new BadRequestError();
//   }

//   const options = { new: true, runValidators: true };
//   const updateUser = await User.findByIdAndUpdate(id, updateRole, options);

//   if (!updateUser) {
//     throw new BadRequestError();
//   }

//   return updateUser;
// };

// const removeAdmin = async (id: string, updateRole: Partial<UserDocument>) => {
//   if (!id) {
//     throw new BadRequestError();
//   }

//   const options = { new: true, runValidators: true };
//   const updateUser = await User.findByIdAndUpdate(id, updateRole, options);

//   if (!updateUser) {
//     throw new BadRequestError();
//   }
//   return updateUser;
// };

// Todo: ban or unban a user by admin
const updateUserStatus = async (
  userId: string,
  status: UpdateQuery<Partial<UserDocument>>
) => {
  if (!userId || !status) {
    throw new BadRequestError("Please provide userId and status!");
  }

  const options = { new: true, runValidators: true };
  const user = await User.findByIdAndUpdate(userId, { status }, options);

  if (!user) {
    throw new NotFoundError(`User Not Found with ${userId}`);
  }
  return user;
};

export default {
  getAllUser,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  sendVerificationEmail,
  updatePassword,
  getUserByResetToken,
  // assingAdmin,
  // removeAdmin,
  updateUserStatus,
};
