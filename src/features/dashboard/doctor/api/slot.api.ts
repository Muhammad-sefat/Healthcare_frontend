import { api } from "@/lib/axios";
import { ClaimSlotPayload, DoctorSchedulesResponse } from "../types/slot";

export const getMyDoctorSchedules = async (): Promise<DoctorSchedulesResponse> => {
  const response = await api.get("/doctor-schedules/my-doctor-schedules");
  return response.data;
};

export const createMyDoctorSchedule = async (
  payload: ClaimSlotPayload
): Promise<DoctorSchedulesResponse> => {
  const response = await api.post("/doctor-schedules/create-my-doctor-schedule", payload);
  return response.data;
};

export const deleteMyDoctorSchedule = async (
  scheduleId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/doctor-schedules/delete-my-doctor-schedule/${scheduleId}`);
  return response.data;
};
