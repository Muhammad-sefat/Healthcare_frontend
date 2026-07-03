import { api } from "@/lib/axios";
import {
  CreateSchedulePayload,
  ScheduleResponse,
  SchedulesResponse,
} from "../types/schedule";

export const createSchedule = async (payload: CreateSchedulePayload): Promise<SchedulesResponse> => {
  const response = await api.post("/schedules", payload);
  return response.data;
};

export const getScheduleById = async (id: string): Promise<ScheduleResponse> => {
  const response = await api.get(`/schedules/${id}`);
  return response.data;
};

export const updateSchedule = async (
  id: string,
  payload: CreateSchedulePayload
): Promise<ScheduleResponse> => {
  const response = await api.patch(`/schedules/${id}`, payload);
  return response.data;
};

export const deleteSchedule = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/schedules/${id}`);
  return response.data;
};
