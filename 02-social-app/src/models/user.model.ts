import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    // Remove the password from the JSON response when the user is returned
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        const { password: _p, ...rest } = ret;
        return rest;
      },
    },
  },
);

const User = model("User", userSchema);

export default User;
