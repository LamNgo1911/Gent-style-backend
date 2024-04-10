import { Types } from "mongoose";

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

// --------- Category ---------
export type Category = {
  id: string;
  name: string;
  image: string;
};

// --------- Product ---------
export enum Size {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
  NONE = "NONE",
}

export type Variant = {
  color: string;
  size: Size;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  variants: Variant[];
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

// --------- Passport ---------
export type Payload = {
  email: string;
  _id: string;
};

export type loginPayload = {
  email: string;
  password: string;
};
