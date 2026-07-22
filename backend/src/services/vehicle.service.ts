import { VehicleRepository } from "../repositories/vehicle.repository";
import { CreateVehicleInput, SearchVehicleQuery } from "../validators/vehicle.validator";
import { ApiError } from "../utils/ApiError";

export class VehicleService {
  private vehicleRepository = new VehicleRepository();

  async createVehicle(input: CreateVehicleInput) {
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

    return this.vehicleRepository.create(input);
  }

  async getVehicles() {
    return this.vehicleRepository.findAll();
  }

  async searchVehicles(query: SearchVehicleQuery) {
    return this.vehicleRepository.search(query);
  }
}
