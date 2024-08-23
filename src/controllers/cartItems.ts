import { NextFunction, Request, Response } from "express";

import cartItemService from "../services/cartItems";
import { BadRequestError } from "../errors/ApiError";
import CartItem from "../models/CartItem";
import { UserDocument } from "../models/User";

// Todo: Get all cartItems by user
export async function getAllCartItemsByUserId(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userInformation = request.user as UserDocument;
    const cartItems = await cartItemService.getAllCartItemsByUserId(
      userInformation._id as string
    );

    response.status(200).json({ cartItems, count: cartItems.length });
  } catch (error) {
    next(error);
  }
}

// Todo: Get a single cartItem by user
export async function getSingleCartItem(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userInformation = request.user as UserDocument;
    const id = request.params.id;

    if (!id) {
      throw new BadRequestError("Please provide cartItem id!");
    }

    const cartItem = await cartItemService.getSingleCartItem(
      id,
      userInformation._id as string
    );

    response.status(200).json({ cartItem });
  } catch (error) {
    next(error);
  }
}

// Todo: Create a new cartItem by user
export async function createCartItem(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userInformation = request.user as UserDocument;
    const { product, color, size, image, quantity } = request.body;

    if (!product || !color || !size || !image || !quantity) {
      throw new BadRequestError("Please fill out all the fields!");
    }

    const cartItem = new CartItem({
      product,
      color,
      size,
      image,
      quantity,
      userId: userInformation._id,
    });

    const newCartItem = await cartItemService.createCartItem(cartItem);
    await newCartItem.populate("product");
    response.status(201).json({ newCartItem });
  } catch (error) {
    next(error);
  }
}

// Todo: Update a cartItem by user
export async function updateCartItem(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userInformation = request.user as UserDocument;
    const id = request.params.id;
    const { quantity } = request.body;

    if (!id) {
      throw new BadRequestError("Please provide cartItem id!");
    }

    if (!quantity) {
      throw new BadRequestError("Please provide quantity to update!");
    }

    const updateCartItem = await cartItemService.updateCartItem(
      id,
      userInformation._id as string,
      quantity
    );

    response.status(200).json({ cartItem: updateCartItem });
  } catch (error) {
    next(error);
  }
}

// Todo: Delete a cartItem by admin
export async function deleteCartItem(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userInformation = request.user as UserDocument;
    const id = request.params.id;

    if (!id) {
      throw new BadRequestError("Please provide cartItem id!");
    }

    const deleteCartItem = await cartItemService.deleteCartItem(
      id,
      userInformation._id as string
    );

    response.status(200).json({ cartItem: deleteCartItem });
  } catch (error) {
    next(error);
  }
}
