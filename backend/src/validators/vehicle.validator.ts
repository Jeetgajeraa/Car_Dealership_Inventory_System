import { z } from "zod";

export const createVehicleSchema = z.object({
  make: z.string().trim().min(1, "Make is required"),
  model: z.string().trim().min(1, "Model is required"),
  categoryId: z.string().trim().min(1, "Category ID is required"),
  price: z.number().positive("Price must be a positive number"),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
  description: z.string().trim().optional(),
});

export const searchVehicleSchema = z.object({
  make: z.string().trim().optional(),
  model: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type SearchVehicleQuery = z.infer<typeof searchVehicleSchema>;
