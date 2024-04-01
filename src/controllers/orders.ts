import { NextFunction, Request, Response } from "express";

import ordersService from "../services/orders";
import Order from "../models/Order";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../errors/ApiError";
import { User } from "../misc/types";
import mongoose from "mongoose";

// Fetching all orders by Admin
export async function getAllOrders(
  _: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const orders = await ordersService.getAllOrders();
    response.status(200).json(orders);
  } catch (error) {
    next(new InternalServerError());
  }
}

// Creating an new order by User
export async function createOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userId = request.params.userId;
    if (!userId) {
      throw new NotFoundError("Missing userId!");
    }

    const data = new Order(...request.body, userId);
    const newOrder = await ordersService.createOrder(data, userId);

    response.status(201).json(newOrder);
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({
        message: `Missing order information or userId!`,
      });
      return;
    } else if (error instanceof mongoose.Error.CastError) {
      response.status(404).json({
        message: "Wrong user id format",
      });
    }
    next(new InternalServerError());
  }
}

// Getting a specific order by Admin or User
export async function getOrderById(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const foundOrder = await ordersService.getOrderById(request.params.orderId);
    response.status(200).json(foundOrder);
  } catch (error) {
    if (error instanceof NotFoundError) {
      response.status(404).json({
        message: `Cant find order with id ${request.params.orderId}`,
      });
    } else if (error instanceof mongoose.Error.CastError) {
      response.status(404).json({
        message: "Wrong id format",
      });
      return;
    } else if (error instanceof BadRequestError) {
      response.status(400).json({
        message: `Missing orderId`,
      });
    }

    next(new InternalServerError());
  }
}

// Updating a specific order by Admin or User
export async function updateOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const orderId = request.params.id;
    const newData = new Order(request.body);
    await ordersService.updateOrder(orderId, newData);
    response.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundError) {
      response.status(404).json({
        message: `Cant find order with id ${request.params.orderId}`,
      });
    } else if (error instanceof mongoose.Error.CastError) {
      response.status(404).json({
        message: "Wrong id format",
      });
      return;
    } else if (error instanceof BadRequestError) {
      response.status(400).json({
        message: `Missing  update information or orderId`,
      });
    }

    next(new InternalServerError());
  }
}

// Cancelling an order by user or Deleting an order by Admin
export async function deleteOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const orderId = request.params.id;
    await ordersService.deleteOrderById(orderId);

    response.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundError) {
      response.status(404).json({
        message: `Cant find order with id ${request.params.orderId}`,
      });
    } else if (error instanceof mongoose.Error.CastError) {
      response.status(404).json({
        message: "Wrong id format",
      });
      return;
    } else if (error instanceof BadRequestError) {
      response.status(400).json({
        message: `Missing orderId`,
      });
    }

    next(new InternalServerError());
  }
}

// Todo: Fetching all orders by user
export async function getAllOrdersByUserId(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userId = request.params.userId;
    const orders = await ordersService.getAllOrdersByUserId(userId);

    response.status(200).json(orders);
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({
        message: `Missing userId`,
      });
    }

    next(new InternalServerError());
  }
}
