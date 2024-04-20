import mongoose, { Document } from "mongoose";

import { Category } from "../misc/types";

const Schema = mongoose.Schema;

export type CategoryDocument = Document & Category;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model<CategoryDocument>("Category", CategorySchema);
