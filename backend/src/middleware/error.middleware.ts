import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors.length > 0 ? err.errors : undefined,
    });
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => issue.message);
    return res.status(400).json({
      success: false,
      message: errors[0] || "Validation Error",
      errors,
    });
  }

  console.error("Unhandled Error:", err);
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
