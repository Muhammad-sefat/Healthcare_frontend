import { z } from "zod";
import { registerSchema } from "../validation/register.schema";

// Form data type inferred from Zod
export type RegisterSchema = z.infer<typeof registerSchema>;

// Request type sent to the backend
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Example response type
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
  };
}
