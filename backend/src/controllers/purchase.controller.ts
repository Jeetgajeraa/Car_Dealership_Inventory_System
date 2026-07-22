import { Request, Response, NextFunction } from "express";
import { PurchaseService } from "../services/purchase.service";

const purchaseService = new PurchaseService();

export const getUserPurchases = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;

    const purchases = await purchaseService.getUserPurchases(userId);

    return res.status(200).json({
      success: true,
      message: "Purchase history retrieved successfully",
      data: purchases,
    });
  } catch (error) {
    next(error);
  }
};
