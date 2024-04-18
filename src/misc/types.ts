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

export type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

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
  shippingAddress: ShippingAddress;
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

export type Color = {
  color: string;
  images: string[];
  countImages: number;
};

export type Variant = {
  color: Color;
  size: Size;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  variants: Variant[];
};

// --------- Order ---------
export enum OrderStatus {
  PAID = "PAID",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export type Shipment = ShippingAddress & {
  method: string;
  trackingNumber: string;
};

export type OrderItem = {
  quantity: number;
  product: Types.ObjectId;
};

export type Order = {
  userId: Types.ObjectId;
  createdAt: Date;
  shipment: Shipment;
  priceSum: number;
  orderItems: OrderItem[];
  status: OrderStatus;
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

// --------- Query ---------

export type SortOptions = {
  [key: string]: { [key: string]: number };
};
