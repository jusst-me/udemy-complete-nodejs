import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import type { LoginBody, SignupBody } from "../types/requests";
import { AppError } from "../errors/AppError";
import User from "../models/user.model";
import { requireAuthCredentials } from "../utils/authHelpers";

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password";

export const signup = async (
  req: Request<object, unknown, SignupBody>,
  res: Response,
  next: NextFunction,
) => {
  const credentials = requireAuthCredentials(req.body, next);
  if (credentials === null) return;

  const { email, password } = credentials;

  const user = await User.findOne({ email });
  if (user) {
    return next(new AppError("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword });

  console.log(newUser);

  res.status(201).json(newUser);
};

export const login = async (
  req: Request<object, unknown, LoginBody>,
  res: Response,
  next: NextFunction,
) => {
  const credentials = requireAuthCredentials(req.body, next);
  if (credentials === null) return;

  const { email, password } = credentials;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(INVALID_CREDENTIALS_MESSAGE, 401));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError(INVALID_CREDENTIALS_MESSAGE, 401));
  }

  res.status(200).json({ message: "Login successful" });
};

export const logout = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(200).json({ message: "Logout successful" });
};
