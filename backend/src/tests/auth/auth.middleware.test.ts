import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authenticate, authorizeRole } from "../../middleware/auth.middleware";
import { ApiError } from "../../utils/ApiError";
import prisma from "../../prisma";

jest.mock("../../prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe("Auth Middleware", () => {
  const secret = process.env.JWT_SECRET || "default_secret";
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("authenticate", () => {
    it("should return 401 ApiError when token is missing", async () => {
      await authenticate(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Authorization header with Bearer token is required");
    });

    it("should return 401 ApiError when token is invalid", async () => {
      req.headers = { authorization: "Bearer invalidtoken" };

      await authenticate(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Invalid or expired token");
    });

    it("should return 401 ApiError when token is expired", async () => {
      const expiredToken = jwt.sign(
        { id: "user-123", email: "user@test.com", role: "USER" },
        secret,
        { expiresIn: "-1s" }
      );
      req.headers = { authorization: `Bearer ${expiredToken}` };

      await authenticate(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Invalid or expired token");
    });

    it("should return 401 ApiError when user is deleted / not found in database", async () => {
      const token = jwt.sign(
        { id: "deleted-user-id", email: "deleted@test.com", role: "USER" },
        secret
      );
      req.headers = { authorization: `Bearer ${token}` };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await authenticate(req as Request, res as Response, next);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "deleted-user-id" },
        select: { id: true, email: true, role: true },
      });
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("User no longer exists");
    });

    it("should pass authentication successfully when token and user exist", async () => {
      const token = jwt.sign(
        { id: "user-123", email: "user@test.com", role: "USER" },
        secret
      );
      req.headers = { authorization: `Bearer ${token}` };

      const mockUser = { id: "user-123", email: "user@test.com", role: "USER" as const };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await authenticate(req as Request, res as Response, next);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
        select: { id: true, email: true, role: true },
      });
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("authorizeRole", () => {
    it("should allow user with matching role", () => {
      req.user = { id: "123", email: "admin@test.com", role: "ADMIN" };
      const middleware = authorizeRole("ADMIN");

      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
    });

    it("should reject user without matching role with 403", () => {
      req.user = { id: "123", email: "user@test.com", role: "USER" };
      const middleware = authorizeRole("ADMIN");

      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(403);
    });

    it("should return 401 if req.user is missing", () => {
      const middleware = authorizeRole("ADMIN");

      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });
  });
});
