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
  "/",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  createOrder
);

// Todo: Get all orders by userId
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  getAllOrdersByUserId
);

// Todo: Get an order by id
router.get(
  "/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  getOrderById
);

// ------------- Admin -------------

// Todo: Get all orders by admin
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  getAllOrders
);

// Todo: Update an order by admin
router.put(
  "/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  updateOrder
);

// Todo: Delete an order by admin
router.delete(
  "/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  deleteOrder
);

export default router;
