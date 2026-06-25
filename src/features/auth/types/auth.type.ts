import { z } from "zod";
import { registerSchema } from "../validation/register.schema";

// Form data type inferred from Zod
export type RegisterSchema = z.infer<typeof registerSchema>;

// Request type sent to the backend
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "PATIENT" | "DOCTOR";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  image: string | null;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  profilePhoto: string | null;
  contactNumber: string | null;
  address: string | null;
  userId: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    patient: Patient;
    accessToken: string;
    refreshToken: string;
  };
}
