import type { Request } from "express";
import { Router } from "express";
import type {
  CommentRouteParams,
  CreateCommentBody,
  DeleteCommentParams,
} from "../types/requests";
import * as commentsController from "../controllers/comments.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router({ mergeParams: true });

// GET /posts/:postId/comments - List comments for a post
router.get(
  "/",
  asyncHandler<Request<CommentRouteParams>>(commentsController.getComments),
);

// POST /posts/:postId/comments - Create a comment on a post
router.post(
  "/",
  asyncHandler<Request<CommentRouteParams, unknown, CreateCommentBody>>(
    commentsController.createComment,
  ),
);

// DELETE /posts/:postId/comments/:commentId - Delete a comment
router.delete(
  "/:commentId",
  asyncHandler<Request<DeleteCommentParams>>(commentsController.deleteComment),
);

export default router;
