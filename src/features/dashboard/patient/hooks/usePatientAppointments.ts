import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getPatientAppointments, 
  initiateAppointmentPayment, 
  cancelPatientAppointment 
} from "../api/appointment.api";
import { toast } from "sonner";

export function useGetPatientAppointments() {
  return useQuery({
    queryKey: ["patient-appointments"],
    queryFn: getPatientAppointments,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: initiateAppointmentPayment,
    onSuccess: (response) => {
      if (response.success && response.data?.paymentUrl) {
        toast.loading("Redirecting to secure Stripe payment checkout...");
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error(response.message || "Failed to initiate appointment payment.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to initiate appointment payment.");
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelPatientAppointment,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
        toast.success("Appointment canceled successfully.");
      } else {
        toast.error(response.message || "Failed to cancel appointment.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to cancel appointment.");
    },
  });
}
