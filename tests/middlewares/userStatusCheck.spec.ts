import { NextFunction, Request, Response } from "express";

import { UserDocument } from "../../src/models/User";
import userStatusCheck from "../../src/middlewares/userStatusCheck";

const mockNextFunction = jest.fn();

describe("userStatusCheck middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest
        .fn()
        .mockReturnValue("Account banned. Contact support for assistance."),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() if user is an admin", () => {
    mockRequest.user = { status: "ACTIVE" } as UserDocument;
    userStatusCheck(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction
    );
    expect(mockNextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});
