import { NextFunction, Response, Request } from "express";

const notFound = (request: Request, response: Response, next: NextFunction) => {
  response.status(404).json(`Not Found - ${request.originalUrl}`);
};

export default notFound;
