import { api } from "@/lib/axios";
import { Doctor } from "@/types";
import { CreateDoctorPayload } from "../types/doctor";

export interface DoctorsResponse {
  success: boolean;
  message: string;
  data: Doctor[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DoctorResponse {
  success: boolean;
  message: string;
  data: Doctor;
}

export const getDoctorsList = async (): Promise<DoctorsResponse> => {
  const response = await api.get("/doctors");
  return response.data;
};

export const createDoctor = async (payload: CreateDoctorPayload): Promise<DoctorResponse> => {
  const { image, ...restPayload } = payload;
  const formData = new FormData();
  formData.append("data", JSON.stringify(restPayload));
  if (image) {
    formData.append("image", image);
  }
  const response = await api.post("/users/create-doctor", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 60000, // Extend timeout to 60 seconds as SMTP mail verification runs during signup
  });
  return response.data;
};

export const deleteDoctor = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/doctors/${id}`);
  return response.data;
};
