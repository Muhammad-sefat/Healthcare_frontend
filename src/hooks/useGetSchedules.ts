import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { SchedulesResponse } from "@/features/dashboard/admin/types/schedule";

export const getSchedulesList = async (params?: { page?: number; limit?: number }): Promise<SchedulesResponse> => {
  const response = await api.get("/schedules", { params });
  return response.data;
};

export function useGetSchedules(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => getSchedulesList(params),
  });
}
