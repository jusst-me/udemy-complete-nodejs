import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/AppError";
import Post from "../models/post.model";

export const getAllPosts = async (req: Request, res: Response) => {
  const posts = await Post.find();
  res.json(posts);
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return next(new AppError("ID is required", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid post ID", 400));
  }

  const post = await Post.findById(id);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  res.json(post);
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return next(new AppError("Title and content are required", 400));
  }

  const post = await Post.create({ title, content });
  res.status(201).json(post);
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!id || typeof id !== "string") {
    return next(new AppError("ID is required", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid post ID", 400));
  }

  if (!title || !content) {
    return next(new AppError("Title and content are required", 400));
  }

  const post = await Post.findByIdAndUpdate(
    id,
    { title, content },
    { returnDocument: "after" },
  );

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  res.json(post);
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return next(new AppError("ID is required", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid post ID", 400));
  }

  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  res.json(post);
};
