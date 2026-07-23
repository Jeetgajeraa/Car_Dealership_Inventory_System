export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  categoryId: string;
  price: number;
  quantity: number;
  description?: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  vehicleId: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  vehicle: Vehicle;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface VehicleFilterParams {
  make?: string;
  model?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateVehiclePayload {
  make: string;
  model: string;
  categoryId: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface UpdateVehiclePayload extends Partial<CreateVehiclePayload> {}

export interface VehicleStats {
  totalVehicles: number;
  totalUnits: number;
  totalInventoryValue: number;
  outOfStockCount: number;
  totalPurchases: number;
  totalRevenue: number;
}

