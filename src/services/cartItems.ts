import { NotFoundError } from "../errors/ApiError";
import CartItem, { CartItemDocument } from "../models/CartItem";

// Todo: Get all cartItems by user
const getAllCartItemsByUserId = async (
  userId: string
): Promise<CartItemDocument[]> => {
  const cartItems: CartItemDocument[] = await CartItem.find({
    userId: userId,
  }).populate("product");

  if (cartItems.length >= 0) {
    return cartItems;
  }

  throw new NotFoundError(`Can not find orders with userId: ${userId}`);
};

// Todo: Get a single cartItem
const getSingleCartItem = async (
  id: string,
  userId: string
): Promise<CartItemDocument> => {
  const cartItem = await CartItem.findOne({ _id: id, userId }).populate(
    "product"
  );

  if (!cartItem) {
    throw new NotFoundError(`CartItem Not Found with id ${id}.`);
  }

  return cartItem;
};

// Todo: Create a new cartItem by admin
const createCartItem = async (
  cartItem: CartItemDocument
): Promise<CartItemDocument> => {
  return (await cartItem.save()).populate("product");
};

// Todo: Update a cartItem by admin
const updateCartItem = async (id: string, userId: string, quantity: number) => {
  const options = { new: true, runValidators: true };

  const updatedCartItem = await CartItem.findByIdAndUpdate(
    { _id: id, userId },
    { quantity },
    options
  ).populate("product");

  if (!updatedCartItem) {
    throw new NotFoundError(`CartItem No Found with cartItem id ${id}`);
  }

  return updatedCartItem;
};

// Todo: Delete a cartItem by admin
const deleteCartItem = async (id: string, userId: string) => {
  const options = { new: true, runValidators: true };
  const cartItem = await CartItem.findOneAndDelete(
    { _id: id, userId },
    options
  ).populate("product");

  if (cartItem) {
    return cartItem;
  }

  throw new NotFoundError(`CartItem Not Found with id ${id}.`);
};

export default {
  getAllCartItemsByUserId,
  getSingleCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
