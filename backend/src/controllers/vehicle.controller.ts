import { Request, Response, NextFunction } from "express";
import { createVehicleSchema } from "../validators/vehicle.validator";
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
