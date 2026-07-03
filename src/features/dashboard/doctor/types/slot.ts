import { Schedule } from "../../admin/types/schedule";

export interface DoctorSchedule {
  doctorId: string;
  scheduleId: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
  schedule: Schedule;
}

export interface DoctorSchedulesResponse {
  success: boolean;
  message: string;
  data: DoctorSchedule[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ClaimSlotPayload {
  scheduleIds: string[];
}
