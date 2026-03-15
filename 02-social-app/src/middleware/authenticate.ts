import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

/**
 * Authenticates the request using the JWT stored in the session cookie.
 * Verifies the token with COOKIE_SECRET (must be set at app startup) and sets
 * req.user = { id: userId }. Use on routes that require a logged-in user.
 * Returns 401 if no token or invalid token.
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const token = req.session?.jwt ?? null;

  if (!token || typeof token !== "string") {
    next(new AppError("Authentication required", 401));
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.COOKIE_SECRET!,
    ) as jwt.JwtPayload & { id: string };

    if (!payload.id) {
      next(new AppError("Invalid token", 401));
      return;
    }

    req.user = { id: String(payload.id) };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}

/**
 * Optionally authenticates: if a valid JWT is present, sets req.user; otherwise
 * continues without req.user. Never returns 401. Use on routes that support both
 * logged-in and anonymous users (e.g. create comment: userId when logged in, anonymous when not).
 */
export function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const token = req.session?.jwt ?? null;

  if (!token || typeof token !== "string") {
    next();
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.COOKIE_SECRET!,
    ) as jwt.JwtPayload & { id: string };

    if (payload.id) {
      req.user = { id: String(payload.id) };
    }
  } catch {
    // Invalid or expired token: continue without req.user (anonymous)
  }
  next();
}
