import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSchedule, updateSchedule, deleteSchedule } from "../api/schedule.api";
import { CreateSchedulePayload } from "../types/schedule";
import { toast } from "sonner";

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSchedule,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
        toast.success("Schedule slots generated successfully!");
      } else {
        toast.error(response.message || "Failed to generate schedules.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to generate schedules.");
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateSchedulePayload }) =>
      updateSchedule(id, payload),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
        toast.success("Schedule slot updated successfully!");
      } else {
        toast.error(response.message || "Failed to update schedule.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update schedule.");
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
        toast.success("Schedule slot deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete schedule.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete schedule.");
    },
  });
}
