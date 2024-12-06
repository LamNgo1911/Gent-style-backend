import { Request, Response, NextFunction } from "express";

import { ForbiddenError } from "../errors/ApiError";
import { Role, User } from "../misc/types";

const adminCheck = (request: Request, _: Response, next: NextFunction) => {
  const userInformation = request.user as User;

  if (userInformation.role !== Role.ADMIN) {
    throw new ForbiddenError("You don't have access to this operation");
  }
  next();
};

export default adminCheck;
