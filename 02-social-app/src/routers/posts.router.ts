import { Router } from "express";
import * as postsController from "../controllers/posts.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// GET /posts - Get all posts
router.get("/", asyncHandler(postsController.getAllPosts));

// GET /posts/:id - Get a post by id
router.get("/:id", asyncHandler(postsController.getPostById));

// POST /posts - Create a new post
router.post("/", asyncHandler(postsController.createPost));

// PUT /posts/:id - Update a post
router.put("/:id", asyncHandler(postsController.updatePost));

// DELETE /posts/:id - Delete a post
router.delete("/:id", asyncHandler(postsController.deletePost));

export default router;
