import mongoose, { Document } from "mongoose";

import { Color, Product, Size } from "../misc/types";

const Schema = mongoose.Schema;

export type ColorDocument = Document & Color;
export type ProductDocument = Document & Product;

const ColorSchema = new Schema<ColorDocument>({
  color: {
    type: String,
    required: true,
    unique: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  countImages: {
    type: Number,
    required: true,
  },
});

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
  variants: [
    {
      color: ColorSchema,
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
