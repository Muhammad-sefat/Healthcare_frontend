import { api } from "@/lib/axios";
import { RegisterRequest, RegisterResponse } from "../types/auth.type";

export const registerUser = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", data);

  return response.data;
};
