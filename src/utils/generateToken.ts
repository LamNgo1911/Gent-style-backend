import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserDocument } from "../models/User";

dotenv.config({ path: ".env" });
const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateToken(user: Partial<UserDocument>, expiresIn: string) {
  return jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: expiresIn,
    }
  );
}
