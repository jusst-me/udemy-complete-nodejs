import type { Request } from "express";
import { Router } from "express";
import type {
  CommentRouteParams,
  CreateCommentBody,
  DeleteCommentParams,
} from "../types/requests";
import { authenticate, optionalAuthenticate } from "../middleware/authenticate";
import { requireCommentOwner } from "../middleware/requireCommentOwner";
import * as commentsController from "../controllers/comments.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router({ mergeParams: true });

// GET /posts/:postId/comments - List comments for a post
router.get(
  "/",
  asyncHandler<Request<CommentRouteParams>>(commentsController.getComments),
);

// POST /posts/:postId/comments - Create a comment (optionalAuthenticate: userId if logged in, else anonymous)
router.post(
  "/",
  optionalAuthenticate,
  asyncHandler<Request<CommentRouteParams, unknown, CreateCommentBody>>(
    commentsController.createComment,
  ),
);

// DELETE /posts/:postId/comments/:commentId - Delete a comment (owner only; req.comment set by middleware)
router.delete(
  "/:commentId",
  authenticate,
  asyncHandler(requireCommentOwner),
  asyncHandler<Request<DeleteCommentParams>>(commentsController.deleteComment),
);

export default router;
