import type { NextFunction, Request, Response } from "express";

interface ErrorWithStatus extends Error {
  statusCode?: number;
  status?: number;
}

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

  const statusCode = err.statusCode ?? err.status ?? 500;
  const message = err.message ?? "Internal Server Error";

  console.error(err.stack);

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" &&
      err.stack && { stack: err.stack }),
  });
};
