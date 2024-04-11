import express from "express";
import passport from "passport";

import {
  getAllUsers,
  createUser,
  deleteUser,
  getSingleUser,
  updateUser,
  loginUser,
  forgotPassword,
  updatePassword,
  updateUserStatus,
  // assingAdmin,
  // removeAdmin,
  // googleLoginCallback,
  resetPassword,
} from "../controllers/users";

import adminCheck from "../middlewares/adminCheck";
import userStatusCheck from "../middlewares/userStatusCheck";

const router = express.Router();

// ---------- Auth ----------
// Todo: Create a new user
router.post("/users/register", createUser);

// Todo: Login a user
router.post("/users/login", loginUser);

// Todo: Send a verification link to user's email
router.route("/users/forgot-password").post(forgotPassword);

// Todo: reset user's password
router.route("/users/reset-password").post(resetPassword);

// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: "/login",
//   }),
//   googleLoginCallback
// );

// ---------- User ----------
// Todo: Get a single user
router.get(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  getSingleUser
);

// Todo: Update user password
router.put(
  "/users/:id/update-password",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  updatePassword
);

// Todo: Update a user
router.put(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  updateUser
);

// ---------- Admin ----------
// Todo: Get all users by admin
router.get(
  "/admin/users",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  getAllUsers
);

// Todo: Get a single user by admin
router.get(
  "/admin/users/:id",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  getSingleUser
);

// Todo: Update user password by admin
router.put(
  "/admin/users/:id/update-password",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  updatePassword
);

// Todo: Update a user by admin
router.put(
  "/admin/users/:id",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  updateUser
);

// Todo: Delete a user by admin
router.delete(
  "/admin/users/:id",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  deleteUser
);

// Todo: ban or unban a user by admin
router.post(
  "/admin/users/change-status",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  updateUserStatus
);

// router.put(
//   "/:id/userInformation",
//   passport.authenticate("jwt", { session: false }),
//   userStatusCheck,
//   adminCheck,
//   assingAdmin
// );

// router.put(
//   "/:id/userInformation",
//   passport.authenticate("jwt", { session: false }),
//   userStatusCheck,
//   adminCheck,
//   removeAdmin
// );

export default router;
