import { Request, Response, NextFunction } from "express";
import {
  createVehicleSchema,
  updateVehicleSchema,
  searchVehicleSchema,
  purchaseVehicleSchema,
  restockVehicleSchema,
} from "../validators/vehicle.validator";
import { VehicleService } from "../services/vehicle.service";

const vehicleService = new VehicleService();

export const createVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createVehicleSchema.parse(req.body);

    const vehicle = await vehicleService.createVehicle(data);

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

export const getVehicles = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vehicles = await vehicleService.getVehicles();

    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

export const getVehicleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;

    const vehicle = await vehicleService.getVehicleById(id);

    return res.status(200).json({
      success: true,
      message: "Vehicle details retrieved successfully",
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

export const searchVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = searchVehicleSchema.parse(req.query);

    const vehicles = await vehicleService.searchVehicles(query);

    return res.status(200).json({
      success: true,
      message: "Vehicles search results",
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    const data = updateVehicleSchema.parse(req.body);

    const vehicle = await vehicleService.updateVehicle(id, data);

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;

    await vehicleService.deleteVehicle(id);

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const purchaseVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    const userId = (req as any).user.id;
    const { quantity } = purchaseVehicleSchema.parse(req.body);

    const result = await vehicleService.purchaseVehicle(id, userId, quantity);

    return res.status(200).json({
      success: true,
      message: "Vehicle purchased successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const restockVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    const { quantity } = restockVehicleSchema.parse(req.body);

    const vehicle = await vehicleService.restockVehicle(id, quantity);

    return res.status(200).json({
      success: true,
      message: "Vehicle restocked successfully",
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};
