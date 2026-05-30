import apiClient from "@/lib/apiClient";
import type { ProfileResponse } from "@/types/auth.type";
import { useQuery } from "@tanstack/react-query";

const fetchProfile = async () => {
  const response = await apiClient.get("/auth/profile");

  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to load profile");
  }

  return response.data as ProfileResponse;
};

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: fetchProfile,
  });
};
