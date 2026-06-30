import { api } from "@/lib/axios";
import { SpecialtiesResponse } from "../types/specialty.type";

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
