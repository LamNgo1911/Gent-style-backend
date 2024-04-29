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
  orders: Types.ObjectId[];
  cartItems: Types.ObjectId[];
};

// --------- Category ---------
export type Category = {
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
  name: string;
  price: number;
  description: string;
  category: Types.ObjectId;
  variants: Variant[];
  images: string[];
};

// --------- Cart ---------
export type CartItem = {
  userId: Types.ObjectId;
  product: Types.ObjectId;
  color: string;
  size: string;
  image: string;
  quantity: number;
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

export type Order = {
  userId: Types.ObjectId;
  shipment: Shipment;
  priceSum: number;
  clientSecret: string;
  orderItems: CartItem[];
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
  createdAt: number;
  price: number;
};
