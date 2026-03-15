import type { NextFunction } from "express";
import { AppError } from "../errors/AppError";
import Post from "../models/post.model";

type PostDoc = Awaited<ReturnType<typeof Post.findById>>;

/**
 * Finds a post by id. If not found, calls next() with 404 and returns null.
 */
export async function findPostOr404(
  postId: string,
  next: NextFunction,
): Promise<NonNullable<PostDoc> | null> {
  const post = await Post.findById(postId);
  if (!post) {
    next(new AppError("Post not found", 404));
    return null;
  }
  return post;
}
