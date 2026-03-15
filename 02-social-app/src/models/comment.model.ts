import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  userName: { type: String, required: false },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = model("Comment", commentSchema);

export default Comment;
