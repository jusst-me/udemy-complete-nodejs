import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler";
import indexRouter from "./routers/index.router";
import cors from "cors";
import cookieSession from "cookie-session";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SECRET!],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === "production",
  }),
);

// CORS middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Routes (registered before listen so they are always available)
app.use(indexRouter);

// Error handler middleware must be last
app.use(errorHandler);

const start = async () => {
  if (!process.env.COOKIE_SECRET) throw new Error("COOKIE_SECRET is not set");
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
