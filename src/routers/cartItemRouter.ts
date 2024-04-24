import express from "express";
import passport from "passport";

import {
  getAllCartItemsByUserId,
  createCartItem,
  deleteCartItem,
  getSingleCartItem,
  updateCartItem,
} from "../controllers/cartItems";
import userStatusCheck from "../middlewares/userStatusCheck";

const router = express.Router();

// ------------ User ------------

// Todo: Get all cartItems by user
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  getAllCartItemsByUserId
);

// Todo: Get a single cartItem
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  getSingleCartItem
);

// Todo: Create a new cartItem by admin
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  createCartItem
);

// Todo: Update a cartItem by admin
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  updateCartItem
);

// Todo: Delete a cartItem by admin
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  deleteCartItem
);

export default router;
