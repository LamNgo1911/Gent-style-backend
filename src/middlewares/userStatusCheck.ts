import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ApiError";
import { UserDocument } from "../models/User";
import { UserStatus } from "../misc/types";

const userStatusCheck = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userInformation = request.user as UserDocument;
  if (userInformation.status !== UserStatus.ACTIVE) {
    throw new ForbiddenError("Account banned. Contact support for assistance.");
  }
  next();
};

export default userStatusCheck;
