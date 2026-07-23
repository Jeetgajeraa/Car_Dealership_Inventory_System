import { api } from "./client";
import type { ApiResponse, AuthResponseData } from "./types";

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponseData> => {
    const response = await api.post<ApiResponse<AuthResponseData>>("/auth/login", {
      email,
      password,
    });
    return response.data.data;
  },

  register: async (name: string, email: string, password: string): Promise<void> => {
    await api.post<ApiResponse<void>>("/auth/register", {
      name,
      email,
      password,
      role: "USER",
    });
  },
};
