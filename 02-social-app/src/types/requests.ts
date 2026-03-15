// Body for POST /posts
export interface CreatePostBody {
  title: string;
  content: string;
}

// Body for PUT /posts/:postId
export interface UpdatePostBody {
  title: string;
  content: string;
}

/** Params for routes under /posts (single post: get, update, delete) */
export interface PostRouteParams extends Record<string, string> {
  postId: string;
}

// Body for POST /posts/:postId/comments
export interface CreateCommentBody {
  content: string;
  userName?: string;
}

// Params for routes under /posts/:postId/comments
export interface CommentRouteParams extends Record<string, string> {
  postId: string;
}

// Params for DELETE /posts/:postId/comments/:commentId
export interface DeleteCommentParams extends CommentRouteParams {
  commentId: string;
}

// Body for POST /auth/signup
export interface SignupBody {
  email: string;
  password: string;
}

// Body for POST /auth/login
export interface LoginBody {
  email: string;
  password: string;
}
