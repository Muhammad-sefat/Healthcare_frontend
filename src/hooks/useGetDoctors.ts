import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Doctor } from "@/types";

export interface DoctorsResponse {
  success: boolean;
  message: string;
  data: Doctor[];
}

export const getDoctorsList = async (): Promise<DoctorsResponse> => {
  const response = await api.get("/doctors");
  return response.data;
};

export function useGetDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctorsList,
    staleTime: 1000 * 60 * 5, // Cache doctors list for 5 minutes
  });
}
