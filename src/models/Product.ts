import mongoose, { Document, Model } from "mongoose";
import { Product, Size } from "../misc/types"

const Schema = mongoose.Schema;

export type ProductDocument = Document & Product

const ProductSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   category: {
      type: String,
      required: true
   },
   size: {
      type: String,
      enum: [Size.Small, Size.Medium, Size.Large],
      required: true
   }
})

export default mongoose.model<ProductDocument>("Products", ProductSchema)