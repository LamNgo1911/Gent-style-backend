import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";

import { Role, User, UserStatus } from "../misc/types";

const Schema = mongoose.Schema;

type UserDocumentMethods = {
  matchPassword(enteredPassword: string): Promise<boolean>;
};

export type UserDocument = Document & User & UserDocumentMethods;

const UserSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: [Role.ADMIN, Role.USER],
    default: Role.USER,
  },
  status: {
    type: String,
    enum: [UserStatus.ACTIVE, UserStatus.DISABLED],
    default: UserStatus.ACTIVE,
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiresAt: {
    type: Date,
    default: null,
  },
  shippingAddress: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Orders",
    },
  ],
});

// Todo: This middleware will hash password before saving user into database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model<UserDocument>("User", UserSchema);
