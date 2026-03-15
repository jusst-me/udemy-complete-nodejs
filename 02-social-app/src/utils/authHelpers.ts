import type { NextFunction } from "express";
import { AppError } from "../errors/AppError";

export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Validates that body has non-empty email and password (trimmed).
 * Normalizes email to lowercase for consistent lookups.
 * Calls next() with 400 and returns null on failure.
 */
export function requireAuthCredentials(
  body: { email?: unknown; password?: unknown },
  next: NextFunction,
): AuthCredentials | null {
  const email = body.email;
  const password = body.password;

  if (email == null || typeof email !== "string" || !email.trim()) {
    next(new AppError("Email and password are required", 400));
    return null;
  }
  if (password == null || typeof password !== "string" || !password.trim()) {
    next(new AppError("Email and password are required", 400));
    return null;
  }

  return {
    email: email.trim().toLowerCase(),
    password: password.trim(),
  };
}
