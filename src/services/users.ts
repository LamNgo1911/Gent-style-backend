import nodemailer from "nodemailer";
import { FilterQuery, UpdateQuery } from "mongoose";

import User, { UserDocument } from "../models/User";
import { NotFoundError, ConflictError } from "../errors/ApiError";

// Todo: Create a new user
const createUser = async (user: UserDocument): Promise<UserDocument> => {
  const { email } = user;

  const isEmailAlreadyAdded = await User.findOne({ email });

  if (isEmailAlreadyAdded) {
    throw new ConflictError("Email already exists.");
  }

  return await user.save();
};

// Todo: Get a user by email
const getUserByEmail = async (email: string): Promise<UserDocument> => {
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
const getUserByResetToken = async (
  resetToken: string
): Promise<UserDocument> => {
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
const getAllUsers = async function getUsers(
  query: FilterQuery<UserDocument>,
  sort: string,
  skip: number,
  limit: number
): Promise<UserDocument[]> {
  return await User.find(query).skip(skip).limit(limit).sort(sort).lean();
};

// Todo: Get a single user
const getSingleUser = async (id: string): Promise<UserDocument> => {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError(`User Not Found with ${id}`);
  }

  return user;
};

// Todo: Update a user
const updateUser = async (id: string, updateData: Partial<UserDocument>) => {
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
const findOrCreate = async (payload: Partial<UserDocument>) => {
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
