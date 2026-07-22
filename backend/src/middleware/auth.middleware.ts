import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { ApiError } from "../utils/ApiError";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError("Authorization header with Bearer token is required", 401)
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "default_secret";
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: "USER" | "ADMIN" };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return next(new ApiError("User no longer exists", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError("Invalid or expired token", 401));
  }
};

export const authorizeRole = (...roles: ("USER" | "ADMIN")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError("Authentication required", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError("Forbidden: Insufficient permissions", 403));
    }

    next();
  };
};
