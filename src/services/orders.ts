import { BadRequestError, NotFoundError } from "../errors/ApiError";
import Order, { OrderDocument } from "../models/Order";

// ------------ User ------------

// Todo: Create a new order
const createOrder = async (order: OrderDocument): Promise<OrderDocument> => {
  return await order.save();
};

// Todo: Get an order by id
const getOrderById = async (
  orderId: string,
  userId: string
): Promise<OrderDocument> => {
  const foundOrder = await Order.findOne({ _id: orderId, userId });
  if (foundOrder) {
    return foundOrder;
  }

  throw new NotFoundError(`Can not find order with orderId: ${orderId}`);
};

// Todo: Get all orders of an user
const getAllOrdersByUserId = async (
  userId: string
): Promise<OrderDocument[]> => {
  const orders: OrderDocument[] = await Order.find({ userId: userId }).populate(
    "orderItems.product"
  );
  if (orders.length >= 0) {
    return orders;
  }

  throw new NotFoundError(`Can not find orders with userId: ${userId}`);
};

// ------------ Admin ------------

// Todo: Get all orders by admin
const getAllOrders = async (): Promise<OrderDocument[]> => {
  return await Order.find();
};

// Todo: Update an order by admin
const updateOrder = async (
  id: string,
  newInformation: Partial<OrderDocument>
) => {
  const updatedOrder = await Order.findByIdAndUpdate(id, newInformation, {
    new: true,
  }).populate("orderItems.product");

  if (updatedOrder) {
    return updatedOrder;
  }

  throw new NotFoundError(`Can not find order with ${id}`);
};

// Todo: Delete an order by admin
const deleteOrderById = async (id: string) => {
  const foundOrder = await Order.findByIdAndDelete(id).populate(
    "orderItems.product"
  );
  if (foundOrder) {
    return foundOrder;
  }

  throw new NotFoundError(`Can not find order with ${id}`);
};

export default {
  getAllOrders,
  createOrder,
  getOrderById,
  deleteOrderById,
  updateOrder,
  getAllOrdersByUserId,
};
