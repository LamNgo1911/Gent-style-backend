import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/ApiError";

function apiErrorhandler(
  error: Error,
  _: Request,
  response: Response,
  next: NextFunction
) {
  console.log(error);
  if (error instanceof BadRequestError) {
    response.status(400).json({ message: error.message });
  } else if (error instanceof ConflictError) {
    response.status(409).json({ message: error.message });
  } else if (error instanceof mongoose.Error.ValidationError) {
    response.status(404).json({ message: error.message });
  } else if (error instanceof mongoose.Error.CastError) {
    response
      .status(404)
      .json({ message: `Resource not found with id of ${error.value}` });
  } else if (error instanceof UnauthorizedError) {
    response.status(401).json({ message: error.message });
  } else if (error instanceof NotFoundError) {
    response.status(404).json({ message: error.message });
  } else if (error instanceof ForbiddenError) {
    response.status(403).json({ message: error.message });
  } else if (error.message.startsWith("E11000 duplicate")) {
    response.status(400).json({ message: error.message });
  } else {
    response.status(500).json({ message: "Internal Server Error" });
  }
}

export default apiErrorhandler;
