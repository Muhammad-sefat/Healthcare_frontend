import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyDoctorSchedules, createMyDoctorSchedule, deleteMyDoctorSchedule } from "../api/slot.api";
import { toast } from "sonner";

export function useGetMyDoctorSchedules() {
  return useQuery({
    queryKey: ["my-doctor-schedules"],
    queryFn: getMyDoctorSchedules,
  });
}

export function useClaimSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMyDoctorSchedule,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["my-doctor-schedules"] });
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
        toast.success("Schedule slot claimed successfully!");
      } else {
        toast.error(response.message || "Failed to claim schedule slot.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to claim schedule slot.");
    },
  });
}

export function useReleaseSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyDoctorSchedule,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["my-doctor-schedules"] });
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
        toast.success("Schedule slot released successfully!");
      } else {
        toast.error(response.message || "Failed to release schedule slot.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to release schedule slot.");
    },
  });
}
