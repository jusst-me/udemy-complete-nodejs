import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

interface ErrorWithStatus extends Error {
  statusCode?: number;
  status?: number;
  isOperational?: boolean;
}

const GENERIC_ERROR_MESSAGE = "Something went wrong";

export const errorHandler = (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // If the headers have already been sent, don't send another response
  if (res.headersSent) {
    return;
  }

  const isOperational = err instanceof AppError && err.isOperational;
  const isProduction = process.env.NODE_ENV === "production";

  const statusCode = err.statusCode ?? err.status ?? 500;
  const message =
    isOperational || !isProduction
      ? (err.message ?? "Internal Server Error")
      : GENERIC_ERROR_MESSAGE;

  console.error(err.stack);

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" &&
      err.stack && { stack: err.stack }),
  });
};
