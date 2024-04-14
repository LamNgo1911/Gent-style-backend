import { BadRequestError, NotFoundError } from "../errors/ApiError";
import Order, { OrderDocument } from "../models/Order";

// Todo: Create a new order
const createOrder = async (
  order: OrderDocument,
  userId: string
): Promise<OrderDocument> => {
  if (!userId || !order) {
    throw new BadRequestError(`Please provide order information and userId!`);
  }

  return await order.save();
};

// Todo: Get an order by id
const getOrderById = async (id: string): Promise<OrderDocument> => {
  if (!id) {
    throw new BadRequestError(`Please provide orderId!`);
  }

  const foundOrder = await Order.findById(id);
  if (foundOrder) {
    return foundOrder;
  }

  throw new NotFoundError(`Can not find order with ${id}`);
};

// Todo: Get all orders by admin
const getAllOrders = async (): Promise<OrderDocument[]> => {
  return await Order.find();
};

// Todo: Get all orders of an user
const getAllOrdersByUserId = async (
  userId: string
): Promise<OrderDocument[]> => {
  if (!userId) {
    throw new BadRequestError(`Please provide userId!`);
  }
  console.log(userId);
  const orders = await Order.find({ userId: userId });
  if (orders !== null) {
    return orders;
  }

  throw new NotFoundError(`Can not find orders with userId: ${userId}`);
};

// Todo: Update an order by admin
const updateOrder = async (
  id: string,
  newInformation: Partial<OrderDocument>
) => {
  if (!newInformation || !id) {
    throw new BadRequestError(`Please provide update information and orderId!`);
  }

  const updatedOrder = await Order.findByIdAndUpdate(id, newInformation, {
    new: true,
  });

  if (updatedOrder) {
    return updatedOrder;
  }

  throw new NotFoundError(`Can not find order with ${id}`);
};

// Todo: Delete an order by admin
const deleteOrderById = async (id: string) => {
  if (!id) {
    throw new BadRequestError(`Please provide orderId!`);
  }

  const foundOrder = await Order.findByIdAndDelete(id);
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
