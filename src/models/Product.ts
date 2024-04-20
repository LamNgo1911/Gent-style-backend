import mongoose, { Document, Schema } from "mongoose";

import { Product, Size } from "../misc/types";

export type ProductDocument = Document & Product;

const VariantSchema = new Schema({
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
    enum: Object.values(Size), // Enumerate available sizes
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
});

const ProductSchema = new Schema(
  {
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
    variants: [VariantSchema], // Use the VariantSchema as a subdocument
    images: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.index({ name: "text" });

export default mongoose.model<ProductDocument>("Products", ProductSchema);
