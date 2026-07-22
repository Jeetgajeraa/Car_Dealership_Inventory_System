import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authenticate, authorizeRole } from "../../middleware/auth.middleware";
import { ApiError } from "../../utils/ApiError";

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
  });

  describe("authenticate", () => {
    it("should pass when valid Bearer token is provided", () => {
      const token = jwt.sign({ id: "123", email: "user@test.com", role: "USER" }, secret);
      req.headers = { authorization: `Bearer ${token}` };

      authenticate(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toEqual({
        id: "123",
        email: "user@test.com",
        role: "USER",
        iat: expect.any(Number),
      });
    });

    it("should return 401 ApiError when authorization header is missing", () => {
      authenticate(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it("should return 401 ApiError when token format is not Bearer", () => {
      req.headers = { authorization: "Basic invalidtoken" };

      authenticate(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it("should return 401 ApiError when token is invalid", () => {
      req.headers = { authorization: "Bearer invalidtoken" };

      authenticate(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
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
