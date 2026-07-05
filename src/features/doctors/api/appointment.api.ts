/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";

export interface BookingPayload {
  doctorId: string;
  scheduleId: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    appointment?: any;
    payment?: any;
    paymentUrl?: string;
  };
}

export const bookAppointmentNow = async (
  payload: BookingPayload,
): Promise<BookingResponse> => {
  const response = await api.post("/appointments/book-appointment", payload);
  return response.data;
};

export const bookAppointmentLater = async (
  payload: BookingPayload,
): Promise<BookingResponse> => {
  const response = await api.post(
    "/appointment/book-appointment-with-pay-later",
    payload,
  );
  return response.data;
};
