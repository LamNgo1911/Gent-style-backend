import { Request, Response, NextFunction } from "express";

import { ForbiddenError } from "../errors/ApiError";
import { User, UserStatus } from "../misc/types";

const userStatusCheck = (request: Request, _: Response, next: NextFunction) => {
  const userInformation = request.user as User;
  if (userInformation.status !== UserStatus.ACTIVE) {
    throw new ForbiddenError("Account banned. Contact support for assistance.");
  }
  next();
};

export default userStatusCheck;
