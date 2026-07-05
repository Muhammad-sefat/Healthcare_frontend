import { api } from "@/lib/axios";
import { Appointment } from "@/types";

export interface AppointmentsResponse {
  success: boolean;
  message: string;
  data: Appointment[];
}

export interface InitiatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentUrl: string;
  };
}

export interface CancelAppointmentResponse {
  success: boolean;
  message: string;
  data: Appointment;
}

export const getPatientAppointments =
  async (): Promise<AppointmentsResponse> => {
    const response = await api.get("/appointments/my-appointments");
    return response.data;
  };

export const initiateAppointmentPayment = async (
  id: string,
): Promise<InitiatePaymentResponse> => {
  const response = await api.post(`/appointment/initiate-payment/${id}`);
  return response.data;
};

export const cancelPatientAppointment = async (
  id: string,
): Promise<CancelAppointmentResponse> => {
  const response = await api.patch(
    `/appointment/change-appointment-status/${id}`,
    {
      status: "CANCELED",
    },
  );
  return response.data;
};
