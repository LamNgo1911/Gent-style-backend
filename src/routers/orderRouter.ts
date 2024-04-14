import express from "express";

import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getAllOrdersByUserId,
  getOrderById,
  updateOrder,
} from "../controllers/orders";
import passport from "passport";
import adminCheck from "../middlewares/adminCheck";
import userStatusCheck from "../middlewares/userStatusCheck";

const router = express.Router();

// ------------- user -------------

// Todo: Create a new order
router.post(
  "/users/:userId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  createOrder
);

// Todo: Get an order by id
router.get(
  "/users/:userId/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  getOrderById
);

// ------------- Admin -------------

// Todo: Get all orders by admin
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  getAllOrders
);

// Todo: Get all orders of an user
router.get(
  "/admin/:userId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  getAllOrdersByUserId
);

// Todo: Update an order by admin
router.put(
  "/admin/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  updateOrder
);

// Todo: Delete an order by admin
router.delete(
  "/admin/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  deleteOrder
);

export default router;
