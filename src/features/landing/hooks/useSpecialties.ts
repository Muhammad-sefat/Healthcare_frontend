import { useQuery } from "@tanstack/react-query";
import { getSpecialtiesList } from "@/features/dashboard/admin/api/specialty.api";

export function useSpecialties() {
  return useQuery({
    queryKey: ["specialties"],
    queryFn: getSpecialtiesList,
  });
}
