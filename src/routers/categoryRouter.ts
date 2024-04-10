import express from "express";
import passport from "passport";

import {
  getAllCategory,
  createCategory,
  deleteCategory,
  getOneCategory,
  updateCategory,
} from "../controllers/categories";
import userStatusCheck from "../middlewares/userStatusCheck";
import adminCheck from "../middlewares/adminCheck";

const router = express.Router();

// ------------ User ------------

// Todo: Get all categories
router.get("/", getAllCategory);

// Todo: Get a single category
router.get("/:id", getOneCategory);

// ------------ Admin ------------

// Todo: Create a new category by admin
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  createCategory
);

// Todo: Update a category by admin
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  updateCategory
);

// Todo: Delete a category by admin
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  deleteCategory
);

export default router;
