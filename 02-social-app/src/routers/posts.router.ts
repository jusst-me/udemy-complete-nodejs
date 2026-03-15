import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { requirePostOwner } from "../middleware/requirePostOwner";
import * as postsController from "../controllers/posts.controller";
import { asyncHandler } from "../utils/asyncHandler";
import commentsRouter from "./comments.router";

const router = Router();

// GET /posts - Get all posts
router.get("/", asyncHandler(postsController.getAllPosts));

// POST /posts - Create a new post (authenticated; author = req.user)
router.post("/", authenticate, asyncHandler(postsController.createPost));

// Comment routes (must be before /:postId so path is unambiguous)
router.use("/:postId/comments", commentsRouter);

// GET /posts/:postId - Get a post by id
router.get("/:postId", asyncHandler(postsController.getPostById));

// PUT /posts/:postId - Update a post (owner only; req.post set by middleware)
router.put("/:postId", authenticate, asyncHandler(requirePostOwner), asyncHandler(postsController.updatePost));

// DELETE /posts/:postId - Delete a post (owner only; req.post set by middleware)
router.delete("/:postId", authenticate, asyncHandler(requirePostOwner), asyncHandler(postsController.deletePost));

export default router;
