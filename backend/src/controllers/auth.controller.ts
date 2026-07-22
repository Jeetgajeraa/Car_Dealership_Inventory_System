import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = registerSchema.parse(req.body);

    await authService.register(
      data.name,
      data.email,
      data.password
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await authService.login(data.email, data.password);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};