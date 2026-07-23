import { api } from "./client";
import type { ApiResponse, Purchase } from "./types";

export const purchasesApi = {
  getUserPurchases: async (): Promise<Purchase[]> => {
    const response = await api.get<ApiResponse<Purchase[]>>("/purchases");
    return response.data.data;
  },
};
