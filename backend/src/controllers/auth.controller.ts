import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: "Not implemented",
  });
};