import { NextFunction, Request, Response } from "express";

import ordersService from "../services/orders";
import Order from "../models/Order";
import { BadRequestError } from "../errors/ApiError";
import { UserDocument } from "../models/User";

// ------------ User ------------

// Todo: Create a new order
export async function createOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userInformation = request.user as UserDocument;
    const { shipment, priceSum, orderItems } = request.body;

    if (!shipment || !priceSum || orderItems.length === 0) {
      throw new BadRequestError(`Please provide order information!`);
    }

    const data = new Order({
      userId: userInformation._id,
      shipment,
      priceSum,
      orderItems,
    });
    const newOrder = await ordersService.createOrder(data);

    response.status(201).json({ newOrder });
  } catch (error) {
    next(error);
  }
}

// Todo: Get an order by id
export async function getOrderById(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { orderId } = request.params;
    const userInformation = request.user as UserDocument;

    if (!orderId) {
      throw new BadRequestError(`Please provide orderId!`);
    }

    const foundOrder = await ordersService.getOrderById(
      orderId,
      userInformation._id
    );
    response.status(200).json({ order: foundOrder });
  } catch (error) {
    next(error);
  }
}

// Todo: Get all orders of an user
export async function getAllOrdersByUserId(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userInformation = request.user as UserDocument;
    const orders = await ordersService.getAllOrdersByUserId(
      userInformation._id
    );

    response.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
}

// ------------ Admin ------------

// Todo: Get all orders by Admin
export async function getAllOrders(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const orders = await ordersService.getAllOrders();
    response.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
}

// Todo: Update an order by admin
export async function updateOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { orderId } = request.params;

    if (!orderId) {
      throw new BadRequestError(`Please provide orderId!`);
    }

    const newData = new Order(request.body);

    await ordersService.updateOrder(orderId, newData);
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

// Todo: Delete an order by admin
export async function deleteOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { orderId } = request.params;

    if (!orderId) {
      throw new BadRequestError(`Please provide orderId!`);
    }

    await ordersService.deleteOrderById(orderId);

    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
