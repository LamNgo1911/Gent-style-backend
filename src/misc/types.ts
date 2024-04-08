import { Types } from "mongoose";

// --------- Category ---------
export type Category = {
  id: string;
  name: string;
  image: string;
};

// --------- Product ---------
export enum Size {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  size: Size;
};

// --------- Order ---------
export type OrderItem = {
  quantity: number;
  productId: Types.ObjectId;
};

export type Order = {
  userId: Types.ObjectId;
  createdAt: Date;
  shipment: string;
  priceSum: number;
  orderItems: OrderItem[];
};

// --------- User ---------
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
export enum UserStatus {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export type UserToRegister = {
  username: string;
  password: string;
  email: string;
};

export type User = UserToRegister & {
  role: Role;
  status: UserStatus;
  resetToken: string | null;
  resetTokenExpiresAt: Date | null;
  orders: Order[];
};

// --------- Passport ---------
export type Payload = {
  email: string;
  _id: string;
};

export type loginPayload = {
  email: string;
  password: string;
};
