import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import Post from "../models/post.model";
import type {
  CreatePostBody,
  PostRouteParams,
  UpdatePostBody,
} from "../types/requests";
import { findPostOr404 } from "../utils/dbHelpers";
import { requireValidObjectId } from "../utils/validateParams";

// GET /posts - Get all posts
export const getAllPosts = async (_req: Request, res: Response) => {
  const posts = await Post.find();
  res.json(posts);
};

// GET /posts/:postId - Get a post by id
export const getPostById = async (
  req: Request<PostRouteParams>,
  res: Response,
  next: NextFunction,
) => {
  const postId = requireValidObjectId(req.params, "postId", "Post ID", next);
  if (postId === null) return;

  const post = await findPostOr404(postId, next);
  if (!post) return;

  res.json(post);
};

// POST /posts - Create a new post (requires authenticate; userId from req.user)
export const createPost = async (
  req: Request<object, unknown, CreatePostBody>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  const { title, content } = req.body;

  if (!title?.trim() || !content?.trim()) {
    return next(new AppError("Title and content are required", 400));
  }

  const post = await Post.create({
    title: title.trim(),
    content: content.trim(),
    userId: req.user.id,
  });
  res.status(201).json(post);
};

// PUT /posts/:postId - Update a post (requires authenticate + requirePostOwner; req.post is set)
export const updatePost = async (
  req: Request<PostRouteParams, unknown, UpdatePostBody>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.post) {
    return next(new AppError("Post not found", 404));
  }

  const { title, content } = req.body;
  if (!title?.trim() || !content?.trim()) {
    return next(new AppError("Title and content are required", 400));
  }

  const post = await Post.findByIdAndUpdate(
    req.post._id,
    { title: title.trim(), content: content.trim() },
    { returnDocument: "after" },
  );

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  res.json(post);
};

// DELETE /posts/:postId - Delete a post (requires authenticate + requirePostOwner; req.post is set)
export const deletePost = async (
  req: Request<PostRouteParams>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.post) {
    return next(new AppError("Post not found", 404));
  }

  await Post.findByIdAndDelete(req.post._id);
  res.status(204).send();
};
