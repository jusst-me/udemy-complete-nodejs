import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import Post from "../models/post.model";
import { requireValidObjectId } from "../utils/validateParams";

/**
 * Ensures the authenticated user owns the post identified by req.params.postId.
 * Loads the post, checks post.userId === req.user.id, then sets req.post so the
 * controller can reuse it (avoids a second DB read).
 * Use after authenticate() on update/delete post routes.
 * Returns 400 if postId invalid, 404 if post not found, 403 if not the owner.
 */
export async function requirePostOwner(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user) {
    next(new AppError("Authentication required", 401));
    return;
  }

  const postId = requireValidObjectId(req.params as Record<string, unknown>, "postId", "Post ID", next);
  if (postId === null) return;

  const post = await Post.findById(postId);
  if (!post) {
    next(new AppError("Post not found", 404));
    return;
  }

  // Compare owner id with authenticated user (ObjectId vs string from JWT)
  if (String(post.userId) !== req.user.id) {
    next(new AppError("You can only modify or delete your own posts", 403));
    return;
  }

  req.post = post as unknown as NonNullable<Request["post"]>;
  next();
}
