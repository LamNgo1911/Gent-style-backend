import express from "express";
import passport from "passport";

import {
  getAllProducts,
  createProduct,
  deleteProduct,
  getSingleProduct,
  updateProduct,
} from "../controllers/products";
import adminCheck from "../middlewares/adminCheck";
import userStatusCheck from "../middlewares/userStatusCheck";

const router = express.Router();

// ---------- User ----------

// Todo: Get all products
router.get("/", getAllProducts);

// Todo: Get a single product
router.get("/:id", getSingleProduct);

// ---------- Admin ----------

// Todo: Create a new product
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  createProduct
);

// Todo: Update a product
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  updateProduct
);

// Todo: Delete a product
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  deleteProduct
);

export default router;
