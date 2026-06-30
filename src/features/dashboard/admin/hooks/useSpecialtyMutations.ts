import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSpecialtiesList, createSpecialty, deleteSpecialty } from "../api/specialty.api";
import { toast } from "sonner";

export function useAdminSpecialties() {
  return useQuery({
    queryKey: ["specialties"],
    queryFn: getSpecialtiesList,
  });
}

export function useCreateSpecialty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSpecialty,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["specialties"] });
        toast.success("Specialty registered successfully!");
      } else {
        toast.error(response.message || "Failed to register specialty.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to register specialty.");
    },
  });
}

export function useDeleteSpecialty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSpecialty,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["specialties"] });
        toast.success("Specialty deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete specialty.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete specialty.");
    },
  });
}
