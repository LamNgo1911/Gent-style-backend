import mongoose, { Document, Schema } from "mongoose";
import { Order, OrderItem, OrderStatus } from "../misc/types";

export type OrderDocument = Document & Order;

export type OrderItemDocument = Document & OrderItem;

const OrderItemSchema = new Schema<OrderItemDocument>({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const OrderSchema = new Schema<OrderDocument>(
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
    orderItems: [OrderItemSchema],
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
