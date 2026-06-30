import { api } from "@/lib/axios";
import { SpecialtiesResponse, SpecialtyResponse } from "../types/specialty";

export const getSpecialtiesList = async (): Promise<SpecialtiesResponse> => {
  const response = await api.get("/specialties");
  if (response.data?.success && Array.isArray(response.data.data)) {
    response.data.data = response.data.data.map((item: any) => ({
      ...item,
      icon: item.image || item.icon,
    }));
  }
  return response.data;
};

export const createSpecialty = async (formData: FormData): Promise<SpecialtyResponse> => {
  const response = await api.post("/specialties", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (response.data?.success && response.data.data) {
    response.data.data = {
      ...response.data.data,
      icon: response.data.data.image || response.data.data.icon,
    };
  }
  return response.data;
};

export const deleteSpecialty = async (id: string): Promise<SpecialtyResponse> => {
  const response = await api.delete(`/specialties/${id}`);
  return response.data;
};
