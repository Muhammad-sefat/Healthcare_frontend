import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/features/auth/api/auth.api";

export function useGetProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5, 
    retry: false,
  });
}
