import { Router } from "express";
import postsRouter from "./posts.router";

const router = Router();

router.use("/posts", postsRouter);

export default router;
