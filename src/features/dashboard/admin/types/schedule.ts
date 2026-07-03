export interface Schedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
  isBooked?: boolean;
}

export interface SchedulesResponse {
  success: boolean;
  message: string;
  data: Schedule[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ScheduleResponse {
  success: boolean;
  message: string;
  data: Schedule;
}

export interface CreateSchedulePayload {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}
