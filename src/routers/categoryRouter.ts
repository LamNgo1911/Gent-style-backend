import express from "express";
import passport from "passport";

import {
  getAllCategories,
  createCategory,
  deleteCategory,
  getSingleCategory,
  updateCategory,
} from "../controllers/categories";
import userStatusCheck from "../middlewares/userStatusCheck";
import adminCheck from "../middlewares/adminCheck";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "src/uploads" });

// ------------ User ------------

// Todo: Get all categories
router.get("/", getAllCategories);

// Todo: Get a single category
router.get("/:id", getSingleCategory);

// ------------ Admin ------------

// Todo: Create a new category by admin
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  upload.single("image"),
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
