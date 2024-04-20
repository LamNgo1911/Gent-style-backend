import { NextFunction, Request, Response } from "express";
import mongoose, { FilterQuery } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

import userService from "../services/users";
import User, { UserDocument } from "../models/User";
import { BadRequestError, ForbiddenError } from "../errors/ApiError";
import { baseUrl } from "../api/baseUrl";
import { UserStatus } from "../misc/types";
import { generateToken } from "../utils/generateToken";

// Todo: Create a new user
export async function createUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { username, password, email, role } = request.body;

    if (!username || !password || !email) {
      throw new BadRequestError("Please fill out all the fields!");
    }
    if (!validator.isEmail(email)) {
      throw new BadRequestError("Please enter a valid email!");
    }

    const user = new User({
      username,
      password,
      email,
      role,
    });

    const newUser = await userService.createUser(user);

    response.status(201).json({ user: newUser });
  } catch (error) {
    next(error);
  }
}

// Todo: login user
export async function loginUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    dotenv.config({ path: ".env" });
    const { email, password } = request.body;

    if (!email || !password) {
      throw new BadRequestError("Please fill out all the fields!");
    }

    if (!validator.isEmail(email)) {
      throw new BadRequestError("Please enter a valid email!");
    }

    const user = await userService.getUserByEmail(email);
    const hashedPassword = user.password;

    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordCorrect) {
      throw new BadRequestError("Invalid credentials!");
    }

    if (user.status === UserStatus.DISABLED) {
      throw new ForbiddenError(
        "Account banned. Contact support for assistance."
      );
    }

    const token = generateToken(user, "1d");
    const refreshToken = generateToken(user, "20d");

    const userInfo = { email: user.email, username: user.username };

    response
      .status(200)
      .json({ token: token, refreshToken: refreshToken, user: userInfo });
  } catch (error) {
    next(error);
  }
}

// Todo: Send verification link to user
export async function forgotPassword(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email } = request.body;
    const user = await userService.getUserByEmail(email);
    const resetToken: string = uuid();

    if (!email) {
      throw new BadRequestError("Please provide your email!");
    }

    if (!validator.isEmail(email)) {
      throw new BadRequestError("Please enter a valid email!");
    }

    const verificationLink = `${baseUrl}/api/v1/users/reset-password?resetToken=${resetToken}`;
    await userService.sendVerificationEmail(email, verificationLink);

    user.resetToken = resetToken;
    user.resetTokenExpiresAt = new Date(Date.now() + 3600000);

    await user.save();

    response
      .status(200)
      .json({ message: "Verification email sent successfully.", resetToken });
  } catch (error) {
    next(error);
  }
}

// Todo: reset password
export async function resetPassword(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { newPassword } = request.body;
    const resetToken = request.query.resetToken as string;

    if (!newPassword || !resetToken) {
      throw new BadRequestError("Invalid or missing reset token");
    }

    const userData = await userService.getUserByResetToken(resetToken);

    if (!userData.resetTokenExpiresAt) {
      throw new BadRequestError("Missing reset token expired time");
    }

    if (Date.now() > userData.resetTokenExpiresAt.getTime()) {
      throw new BadRequestError("Expired reset token");
    }

    const newUserData = await userService.updatePassword(userData, newPassword);

    response
      .status(200)
      .json({ user: newUserData, message: "Password reset successful." });
  } catch (error) {
    next(error);
  }
}

type UserQuery = {
  filter?: string;
  search?: string;
};

// Todo: Get all users
export async function getAllUsers(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { filter, search } = request.query as UserQuery;
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query: FilterQuery<UserDocument> = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (filter === "Active") {
      query.status = UserStatus.ACTIVE;
    } else if (filter === "Disabled") {
      query.status = UserStatus.DISABLED;
    }

    const count = await User.countDocuments(query);

    const users = await userService.getAllUsers(
      query,
      "-createdAt",
      skip,
      limit
    );

    response.status(200).json({ users, count });
  } catch (error) {
    next(error);
  }
}

// Todo: Get a single user
export async function getSingleUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const id = request.params.id;

    if (!id) {
      throw new BadRequestError("Please provide userId!");
    }

    const user = await userService.getSingleUser(id);

    response.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

// Todo: Update a user
export async function updateUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const id = request.params.id;
    const { username, email } = request.body;

    if (!id) {
      throw new BadRequestError("Please provide userId!");
    }

    if (!validator.isEmail(email)) {
      throw new BadRequestError("Please enter a valid email!");
    }

    const updateUser = await userService.updateUser(id, { username, email });

    response.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
}

// Todo: Update password
export async function updatePassword(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const id = request.params.id;
    const { oldPassword, newPassword } = request.body;

    if (!id) {
      throw new BadRequestError("Please provide userId!");
    }

    if (!oldPassword || !newPassword) {
      throw new BadRequestError("Please fill out all the fields!");
    }

    const userData = await userService.getSingleUser(id);

    const hashedPassword = userData.password;

    const isPasswordCorrect = await bcrypt.compare(oldPassword, hashedPassword);

    if (!isPasswordCorrect) {
      throw new BadRequestError("Wrong password!");
    }

    const user = await userService.updatePassword(userData, newPassword);

    response.status(200).send({ user, message: "User updated!" });
  } catch (error) {
    next(error);
  }
}

// Todo: Delete a user by admin
export async function deleteUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const id = request.params.id;

    if (!id) {
      throw new BadRequestError("Please provide userId!");
    }

    const user = await userService.deleteUser(id);

    response.status(200).json({ user, message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
}

// Todo: ban or unban a user by admin
export async function updateUserStatus(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { userId, status } = request.body;

    if (!userId || !status) {
      throw new BadRequestError("Please provide userId and status!");
    }

    const user = await userService.updateUserStatus(userId, status);

    response.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

// Todo: Login with google
export async function googleLogin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    // logic
    const userGoogleData = request.user as UserDocument;
    const token = generateToken(userGoogleData, "1h");

    response.status(200).json({ token, userGoogleData });
  } catch (error) {
    next(error);
  }
}
