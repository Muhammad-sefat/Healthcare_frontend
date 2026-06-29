/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { RegisterRequest, RegisterResponse } from "../types/auth.type";

export const registerUser = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", data);

  return response.data;
};

export const loginUser = async (data: any): Promise<any> => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const verifyEmail = async (data: {
  email: string;
  otp: string;
}): Promise<any> => {
  const response = await api.post("/auth/verify-email", data);

  return response.data;
};

export const getMe = async (): Promise<any> => {
  const response = await api.get("/auth/me");
  return response.data;
};
