import mongoose, { Document } from "mongoose";

import { Product, Size } from "../misc/types";

const Schema = mongoose.Schema;

export type ProductDocument = Document & Product;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  variants: [
    {
      color: {
        type: String,
        required: true,
        default: "NONE",
      },
      size: {
        type: String,
        enum: Object.values(Size),
        required: true,
        default: Size.NONE,
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
});

ProductSchema.index({ name: "text" });

export default mongoose.model<ProductDocument>("Products", ProductSchema);
