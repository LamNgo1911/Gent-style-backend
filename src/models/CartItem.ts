import mongoose, { Document, Schema } from "mongoose";
import { CartItem } from "../misc/types";
import { ProductSchema } from "./Product";

export type CartItemDocument = Document & CartItem;

export const CartItemSchema = new Schema<CartItemDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model<CartItemDocument>("CartItem", CartItemSchema);
