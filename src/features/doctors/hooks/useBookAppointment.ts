import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookAppointmentNow, bookAppointmentLater, BookingPayload } from "../api/appointment.api";
import { toast } from "sonner";

export function useBookAppointmentNow() {
  return useMutation({
    mutationFn: bookAppointmentNow,
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

export function useBookAppointmentLater(onSuccessCallback: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookAppointmentLater,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["doctor"] });
        toast.success("Appointment booked successfully (Pay Later status)!");
        onSuccessCallback();
      } else {
        toast.error(response.message || "Failed to book appointment.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to book appointment.");
    },
  });
}
