import type { Types } from "mongoose";

/**
 * Extended Express Request: auth and ownership middleware set these.
 * - user: set by authenticate middleware after valid JWT
 * - post: set by requirePostOwner when the authenticated user owns the post
 * - comment: set by requireCommentOwner when the authenticated user owns the comment
 */
declare global {
  namespace Express {
    interface Request {
      session?: { jwt?: string | null };
      user?: { id: string };
      /** Set by requirePostOwner; use in update/delete post controllers to avoid re-fetching */
      post?: { _id: Types.ObjectId; userId: Types.ObjectId; [key: string]: unknown };
      /** Set by requireCommentOwner; use in delete comment controller to avoid re-fetching */
      comment?: { _id: Types.ObjectId; userId?: Types.ObjectId | null; [key: string]: unknown };
    }
  }
}

export {};
