import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authController from "../controllers/auth.controller";

const router = Router();

// POST /auth/signup - Sign up a new user
router.post("/signup", asyncHandler(authController.signup));

// POST /auth/login - Log in a user
router.post("/login", asyncHandler(authController.login));

// GET /auth/logout - Log out a user
router.get("/logout", asyncHandler(authController.logout));

export default router;
