import { Router } from "express";
import postsRouter from "./posts.router";
import authRouter from "./auth.router";

const router = Router();

// API routes
const basePath = `/${process.env.API_PREFIX || "api"}`;
router.use(`${basePath}/posts`, postsRouter);

// Auth routes
router.use("/auth", authRouter);

export default router;
