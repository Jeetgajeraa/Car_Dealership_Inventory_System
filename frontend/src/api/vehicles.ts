import { api } from "./client";
import type {
  ApiResponse,
  Vehicle,
  VehicleFilterParams,
  CreateVehiclePayload,
  UpdateVehiclePayload,
  Purchase,
} from "./types";

export const vehiclesApi = {
  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await api.get<ApiResponse<Vehicle[]>>("/vehicles");
    return response.data.data;
  },

  getMyVehicles: async (): Promise<Vehicle[]> => {
    const response = await api.get<ApiResponse<Vehicle[]>>("/vehicles/my");
    return response.data.data;
  },

  searchVehicles: async (filters: VehicleFilterParams): Promise<Vehicle[]> => {
    // Filter out empty params
    const cleanParams: Record<string, any> = {};
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== "" && val !== null) {
        cleanParams[key] = val;
      }
    });

    const response = await api.get<ApiResponse<Vehicle[]>>("/vehicles/search", {
      params: cleanParams,
    });
    return response.data.data;
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    const response = await api.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    return response.data.data;
  },

  createVehicle: async (payload: CreateVehiclePayload): Promise<Vehicle> => {
    const response = await api.post<ApiResponse<Vehicle>>("/vehicles", payload);
    return response.data.data;
  },

  updateVehicle: async (id: string, payload: UpdateVehiclePayload): Promise<Vehicle> => {
    const response = await api.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, payload);
    return response.data.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/vehicles/${id}`);
  },

  purchaseVehicle: async (id: string, quantity: number): Promise<Purchase> => {
    const response = await api.post<ApiResponse<Purchase>>(`/vehicles/${id}/purchase`, {
      quantity,
    });
    return response.data.data;
  },

  restockVehicle: async (id: string, quantity: number): Promise<Vehicle> => {
    const response = await api.post<ApiResponse<Vehicle>>(`/vehicles/${id}/restock`, {
      quantity,
    });
    return response.data.data;
  },
};
