import { NextFunction, Request, Response } from "express";
import mongoose, { FilterQuery } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

import userService from "../services/user";
import User, { UserDocument } from "../models/User";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from "../errors/ApiError";
import { baseUrl } from "../api/baseUrl";
import { loginPayload, UserStatus, UserToRegister } from "../misc/types";

// Todo: Create a new user
export async function createUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { username, password, email, role, status } = request.body;

  try {
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
      status,
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

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "20d" }
    );

    response
      .status(200)
      .json({ token: token, refreshToken: refreshToken, user });
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

    if (!validator.isEmail(email)) {
      throw new BadRequestError("Please enter a valid email!");
    }

    const verificationLink = `${baseUrl}/reset-password?resetToken=${resetToken}`;
    await userService.sendVerificationEmail(email, verificationLink);

    user.resetToken = resetToken;
    user.resetTokenExpiresAt = new Date(Date.now() + 3600000);

    await user.save();

    response
      .status(200)
      .json({ message: "Verification email sent successfully." });
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
export async function getAllUser(
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
    const pageCount = Math.ceil(count / limit);

    const users = await userService.getAllUser(
      query,
      "-createdAt",
      skip,
      limit
    );

    response.status(200).json({ users, pagination: { count, pageCount } });
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
    const { oldPassword, newPassword } = request.body;

    if (!oldPassword || !newPassword) {
      throw new BadRequestError(
        "Please provide both oldPassword and newPassword!"
      );
    }

    const userData = await userService.getSingleUser(request.params.id);

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
    const user = await userService.deleteUser(id);

    response.status(200).json({ user, message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
}

// export async function googleLogin(request: Request, response: Response) {
//   console.log("hello google login");
//   try {
//   } catch (error) {
//     console.log(error);
//     throw new InternalServerError("Something went wrong");
//   }
// }
// export async function googleLoginCallback(
//   request: Request,
//   response: Response
// ) {
//   console.log("inside the google login callback");
//   try {
//     const user = request.user;
//     response.status(200).json({ user });
//   } catch (error) {
//     console.log(error);
//     throw new InternalServerError("Something went wrong");
//   }
// }

// export async function loginUserForGoogelUser(data: loginPayload) {
//   try {
//     const { email, password } = data;
//     const userData = await userService.getUserByEmail(email);
//     const hashedPassword = userData.password;

//     const isPasswordCorrect = await bcrypt.hash(
//       password.toString(),
//       hashedPassword.toString()
//     );

//     if (!isPasswordCorrect) {
//       throw new BadRequestError("Wrong password");
//     }

//     const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET!, {
//       expiresIn: "1h",
//     });

//     const refreshToken = jwt.sign(
//       { email: userData.email, role: userData.role },
//       process.env.JWT_SECRET!,
//       { expiresIn: "20d" }
//     );

//     return { token: token, refreshToken: refreshToken, userData };
//   } catch (error) {
//     if (error instanceof BadRequestError) {
//       throw new BadRequestError(error.message);
//     } else if (error instanceof UnauthorizedError) {
//       throw new UnauthorizedError(error.message);
//     } else if (error instanceof NotFoundError) {
//       throw new NotFoundError(error.message);
//     } else {
//       throw new InternalServerError("Internal server error");
//     }
//   }
// }
// export async function registerUserForGoogelUser(data: UserToRegister) {
//   const { username, password, email } = data;

//   try {
//     if (!username || !password || !email) {
//       throw new BadRequestError("Fill out all the fields");
//     } else if (!validator.isEmail(email)) {
//       throw new BadRequestError("Please enter a valid email");
//     }
//     const saltRounds = 10;
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = new User({
//       username,
//       password: hashedPassword,
//       email,
//       role: "CUSTOMER",
//       status: "ACTIVE",
//     });

//     const newUser = (await userService.createUser(user)) as UserDocument;
//     const loginUser = await loginUserForGoogelUser({
//       email: newUser["email"],
//       password: newUser["password"],
//     });
//     return { loginUser };
//   } catch (error) {
//     if (error instanceof BadRequestError) {
//       throw new BadRequestError(error.message);
//     } else if (error instanceof InternalServerError) {
//       throw new InternalServerError("Something went wrong");
//     } else {
//       throw new InternalServerError("Something went wrong");
//     }
//   }
// }

// export async function assingAdmin(request: Request, response: Response) {
//   const id = request.params.id;
//   const { role } = request.body;

//   try {
//     if (!id) {
//       throw new BadRequestError("Missing user ID");
//     }
//     const updatedRole: UserDocument = await userService.assingAdmin(id, {
//       role: role,
//     });

//     response.status(200).json(updatedRole);
//   } catch (error) {
//     if (error instanceof BadRequestError) {
//       response.status(400).json({ error: "Invalid request" });
//     } else if (error instanceof NotFoundError) {
//       response.status(404).json({ error: "User not found" });
//     } else if (error instanceof mongoose.Error.CastError) {
//       response.status(400).json({
//         message: "Wrong id",
//       });
//       return;
//     } else {
//       response.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// }

// export async function removeAdmin(request: Request, response: Response) {
//   const id = request.params.id;
//   const { role } = request.body;

//   try {
//     if (!id) {
//       throw new BadRequestError("Missing user ID");
//     }
//     const updatedRole: UserDocument = await userService.removeAdmin(id, {
//       role: role,
//     });

//     response.status(200).json(updatedRole);
//   } catch (error) {
//     if (error instanceof BadRequestError) {
//       response.status(400).json({ error: "Invalid request" });
//     } else if (error instanceof NotFoundError) {
//       response.status(404).json({ error: "User not found" });
//     } else if (error instanceof mongoose.Error.CastError) {
//       response.status(400).json({
//         message: "Wrong id",
//       });
//       return;
//     } else {
//       response.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// }

// Todo: ban or unban a user by admin
export async function updateUserStatus(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { userId, status } = request.body;
    const user = await userService.updateUserStatus(userId, status);

    response.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}
