import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import Comment from "../models/comment.model";
import type {
  CommentRouteParams,
  CreateCommentBody,
  DeleteCommentParams,
} from "../types/requests";
import { findPostOr404 } from "../utils/dbHelpers";
import { requireValidObjectId } from "../utils/validateParams";

// GET /posts/:postId/comments - List comments for a post
export const getComments = async (
  req: Request<CommentRouteParams>,
  res: Response,
  next: NextFunction,
) => {
  const postId = requireValidObjectId(req.params, "postId", "Post ID", next);
  if (postId === null) return;

  const post = await findPostOr404(postId, next);
  if (!post) return;

  const comments = await Comment.find({ postId })
    .sort({ createdAt: 1 })
    .populate("userId", "email")
    .lean();
  res.json(comments);
};

// POST /posts/:postId/comments - Create a comment (optional auth: if logged in set userId, else anonymous → show "Anonymous" in frontend)
export const createComment = async (
  req: Request<CommentRouteParams, unknown, CreateCommentBody>,
  res: Response,
  next: NextFunction,
) => {
  const postId = requireValidObjectId(req.params, "postId", "Post ID", next);
  if (postId === null) return;

  const { content } = req.body;
  if (!content?.trim()) {
    return next(new AppError("Content is required", 400));
  }

  const post = await findPostOr404(postId, next);
  if (!post) return;

  const comment = await Comment.create({
    postId,
    content: content.trim(),
    ...(req.user && { userId: req.user.id }),
  });
  res.status(201).json(comment);
};

// DELETE /posts/:postId/comments/:commentId - Delete a comment (requires authenticate + requireCommentOwner; req.comment is set)
export const deleteComment = async (
  req: Request<DeleteCommentParams>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.comment) {
    return next(new AppError("Comment not found", 404));
  }

  await Comment.findByIdAndDelete(req.comment._id);
  res.status(204).send();
};
