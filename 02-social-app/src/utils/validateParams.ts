import type { NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/AppError";

/**
 * Ensures a route param is present, a string, and a valid MongoDB ObjectId.
 * Calls next() with 400 and returns null on failure; returns the value on success.
 */
export function requireValidObjectId(
  params: Record<string, unknown>,
  key: string,
  label: string,
  next: NextFunction,
): string | null {
  const value = params[key];
  if (value == null || typeof value !== "string" || value.trim() === "") {
    next(new AppError(`${label} is required`, 400));
    return null;
  }
  if (!mongoose.Types.ObjectId.isValid(value)) {
    next(new AppError(`Invalid ${label}`, 400));
    return null;
  }
  return value;
}
