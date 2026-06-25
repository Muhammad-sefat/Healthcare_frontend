import { api } from "@/lib/axios";
import { SpecialtiesResponse } from "../types/specialty.type";

export const getSpecialtiesList = async (): Promise<SpecialtiesResponse> => {
  const response = await api.get("/specialties");
  return response.data;
};
