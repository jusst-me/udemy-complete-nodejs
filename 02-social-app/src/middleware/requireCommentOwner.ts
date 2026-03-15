import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import Comment from "../models/comment.model";
import { requireValidObjectId } from "../utils/validateParams";

/**
 * Ensures the authenticated user owns the comment identified by req.params.commentId
 * (and that the comment belongs to the post in req.params.postId).
 * Loads the comment, checks comment.userId === req.user.id, then sets req.comment
 * so the controller can reuse it (avoids a second DB read).
 * Use after authenticate() on delete comment route.
 * Anonymous comments (no userId) cannot be deleted by anyone via this middleware.
 * Returns 400 if params invalid, 404 if comment not found, 403 if not the owner.
 */
export async function requireCommentOwner(
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

  const commentId = requireValidObjectId(
    req.params as Record<string, unknown>,
    "commentId",
    "Comment ID",
    next,
  );
  if (commentId === null) return;

  const comment = await Comment.findOne({ _id: commentId, postId });
  if (!comment) {
    next(new AppError("Comment not found", 404));
    return;
  }

  // Anonymous comments have no userId; only the author (logged-in user who created it) can delete
  if (!comment.userId) {
    next(new AppError("Only the author can delete this comment", 403));
    return;
  }

  if (String(comment.userId) !== req.user.id) {
    next(new AppError("You can only delete your own comments", 403));
    return;
  }

  req.comment = comment as unknown as NonNullable<Request["comment"]>;
  next();
}
