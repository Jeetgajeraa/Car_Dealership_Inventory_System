import { VehicleRepository } from "../repositories/vehicle.repository";
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  SearchVehicleQuery,
} from "../validators/vehicle.validator";
import { ApiError } from "../utils/ApiError";

export class VehicleService {
  private vehicleRepository = new VehicleRepository();

  async createVehicle(input: CreateVehicleInput, userId?: string) {
    const existing = await this.vehicleRepository.findByMakeModelCategory(
      input.make,
      input.model,
      input.categoryId
    );

    if (existing) {
      throw new ApiError(
        "Vehicle with this make, model and category already exists",
        409
      );
    }

    return this.vehicleRepository.create({
      ...input,
      createdById: userId,
    });
  }

  async getVehicles() {
    return this.vehicleRepository.findAll();
  }

  async getMyVehicles(userId: string) {
    return this.vehicleRepository.findByCreatedById(userId);
  }

  async getVehicleById(id: string) {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) {
      throw new ApiError("Vehicle not found", 404);
    }

    return vehicle;
  }

  async searchVehicles(query: SearchVehicleQuery) {
    return this.vehicleRepository.search(query);
  }

  async updateVehicle(
    id: string,
    input: UpdateVehicleInput,
    user?: { id: string; role: "USER" | "ADMIN" }
  ) {
    const existing = await this.vehicleRepository.findById(id);

    if (!existing) {
      throw new ApiError("Vehicle not found", 404);
    }

    if (user && user.role !== "ADMIN" && existing.createdById !== user.id) {
      throw new ApiError(
        "Forbidden: You can only edit vehicles created by you",
        403
      );
    }

    // Quantity is always excluded from updates — use the Restock endpoint instead
    const { quantity: _qty, ...updateData } = input;

    return this.vehicleRepository.update(id, updateData);
  }

  async deleteVehicle(id: string) {
    const existing = await this.vehicleRepository.findById(id);

    if (!existing) {
      throw new ApiError("Vehicle not found", 404);
    }

    return this.vehicleRepository.delete(id);
  }

  async purchaseVehicle(vehicleId: string, userId: string, quantity: number) {
    const existing = await this.vehicleRepository.findById(vehicleId);

    if (!existing) {
      throw new ApiError("Vehicle not found", 404);
    }

    if (existing.quantity < quantity) {
      throw new ApiError("Insufficient stock", 400);
    }

    return this.vehicleRepository.purchase(vehicleId, userId, quantity);
  }

  async restockVehicle(vehicleId: string, quantity: number) {
    const existing = await this.vehicleRepository.findById(vehicleId);

    if (!existing) {
      throw new ApiError("Vehicle not found", 404);
    }

    return this.vehicleRepository.restock(vehicleId, quantity);
  }

  async getStats() {
    return this.vehicleRepository.getStats();
  }
}
