import { Router } from "express";
import * as postsController from "../controllers/posts.controller";
import { asyncHandler } from "../utils/asyncHandler";
import commentsRouter from "./comments.router";

const router = Router();

// GET /posts - Get all posts
router.get("/", asyncHandler(postsController.getAllPosts));

// POST /posts - Create a new post
router.post("/", asyncHandler(postsController.createPost));

// Comment routes (must be before /:postId so path is unambiguous)
router.use("/:postId/comments", commentsRouter);

// GET /posts/:postId - Get a post by id
router.get("/:postId", asyncHandler(postsController.getPostById));

// PUT /posts/:postId - Update a post
router.put("/:postId", asyncHandler(postsController.updatePost));

// DELETE /posts/:postId - Delete a post
router.delete("/:postId", asyncHandler(postsController.deletePost));

export default router;
