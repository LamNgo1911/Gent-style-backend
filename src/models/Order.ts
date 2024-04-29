import mongoose, { Document, Schema } from "mongoose";
import { Order, OrderStatus } from "../misc/types";
import { CartItemSchema } from "./CartItem";

export type OrderDocument = Document & Order;

export const OrderSchema = new Schema<OrderDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shipment: {
      method: {
        type: String,
        required: true,
      },
      trackingNumber: {
        type: String,
        required: false,
      },
      address: {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
      },
    },
    priceSum: {
      type: Number,
      required: true,
    },
    clientSecret: {
      type: String,
      required: [true, "Please add clientSecret"],
    },
    orderItems: [
      {
        type: CartItemSchema,
      },
    ],
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PAID,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model<OrderDocument>("Order", OrderSchema);
