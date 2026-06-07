import apiClient from "@/lib/apiClient";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { toast } from "@/lib/toast";
import type { ChangePasswordRequest, ProfileResponse, UpdateProfileRequest } from "@/types/auth.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FieldValues, UseFormSetError } from "react-hook-form";

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

export const useUpdateProfileMutation = <T extends FieldValues>(setError: UseFormSetError<T>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "update-profile"],
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await apiClient.patch("/auth/profile", data);

      if (response.status === 400) {
        throw new ValidationError(response.data || "Validation Error");
      }

      if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to update profile");
      }

      return response.data as ProfileResponse;
    },
    onSuccess: async () => {
      toast.success("Profile updated successfully.");
      await queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
    onError: (err) => {
      if (err instanceof ValidationError) {
        handleNestError(err.response, setError);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });
};

export const useChangePasswordMutation = <T extends FieldValues>(setError: UseFormSetError<T>) => {
  return useMutation({
    mutationKey: ["auth", "change-password"],
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await apiClient.patch("/auth/change-password", data);

      if (response.status === 400) {
        throw new ValidationError(response.data || "Validation Error");
      }

      if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to update password");
      }

      return response.data as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password updated successfully.");
    },
    onError: (err) => {
      if (err instanceof ValidationError) {
        handleNestError(err.response, setError);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });
};
