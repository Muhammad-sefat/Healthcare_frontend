import { useQuery } from "@tanstack/react-query";
import { getSpecialtiesList } from "../services/specialty.api";

export function useSpecialties() {
  return useQuery({
    queryKey: ["specialties"],
    queryFn: getSpecialtiesList,
  });
}
