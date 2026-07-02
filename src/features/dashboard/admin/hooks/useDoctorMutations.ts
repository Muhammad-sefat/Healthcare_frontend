import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDoctorsList, createDoctor, deleteDoctor } from "../api/doctor.api";
import { toast } from "sonner";

export function useAdminDoctors() {
  return useQuery({
    queryKey: ["admin-doctors"],
    queryFn: getDoctorsList,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDoctor,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
        toast.success("Doctor registered successfully!");
      } else {
        toast.error(response.message || "Failed to register doctor.");
      }
    },
    onError: (error: any) => {
      const responseData = error?.response?.data;
      const dbError = responseData?.error;
      const errorMsg = responseData?.message;

      if (dbError && typeof dbError === "string" && dbError.includes("Unique constraint failed")) {
        if (dbError.includes("registrationNumber")) {
          toast.error("Registration Number is already in use. Please check and try a different one.");
          return;
        }
        if (dbError.includes("email")) {
          toast.error("Email address is already registered. Please check and try another one.");
          return;
        }
      }
      toast.error(errorMsg || "Failed to register doctor.");
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDoctor,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
        toast.success("Doctor deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete doctor.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete doctor.");
    },
  });
}
