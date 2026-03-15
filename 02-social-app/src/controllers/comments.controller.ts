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

  const comments = await Comment.find({ postId }).sort({ createdAt: 1 }).lean();
  res.json(comments);
};

// POST /posts/:postId/comments - Create a comment on a post
export const createComment = async (
  req: Request<CommentRouteParams, unknown, CreateCommentBody>,
  res: Response,
  next: NextFunction,
) => {
  const postId = requireValidObjectId(req.params, "postId", "Post ID", next);
  if (postId === null) return;

  const { content, userName } = req.body;
  if (!content?.trim()) {
    return next(new AppError("Content is required", 400));
  }

  const post = await findPostOr404(postId, next);
  if (!post) return;

  const hasUserName =
    userName != null && userName !== "" && String(userName).trim() !== "";

  const comment = await Comment.create({
    postId,
    content: content.trim(),
    ...(hasUserName && { userName }),
  });
  res.status(201).json(comment);
};

// DELETE /posts/:postId/comments/:commentId - Delete a comment
export const deleteComment = async (
  req: Request<DeleteCommentParams>,
  res: Response,
  next: NextFunction,
) => {
  const postId = requireValidObjectId(req.params, "postId", "Post ID", next);
  if (postId === null) return;

  const commentId = requireValidObjectId(
    req.params,
    "commentId",
    "Comment ID",
    next,
  );
  if (commentId === null) return;

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    postId,
  });

  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  res.status(204).send();
};
