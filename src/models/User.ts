import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

import { Role, User, UserStatus } from "../misc/types";

const Schema = mongoose.Schema;

export type UserDocument = Document & User;

const UserSchema = new Schema({
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
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Orders",
    },
  ],
});

UserSchema.index({ resetToken: 1 }, { unique: true });

// Todo: This middleware will hash password before saving user into database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Todo: compare enter password and hash password
UserSchema.methods.matchPassword = async function name(
  enterPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enterPassword, this.password);
};

export default mongoose.model<UserDocument>("User", UserSchema);
