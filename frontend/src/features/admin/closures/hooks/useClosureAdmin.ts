import { closureApi } from "@/features/shared/closures/api/closure.api";
import type { CreateClosureDto } from "@/features/shared/closures/types/closure.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetClosureForBookingQuery = (accommodationId?: string) =>
  useQuery({
    queryKey: ['closure', 'getForBooking', accommodationId],
    queryFn: () => closureApi.getBookingForClosure(accommodationId),
    refetchOnWindowFocus: false,
  });

export const useCreateClosureMutation = (accommodationId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['closure', 'create', accommodationId],
    mutationFn: (data: CreateClosureDto) => closureApi.createClosure(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['closure', 'get', accommodationId] }),
  });
};

export const useDeleteClosureMutation = (accommodationId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['closure', 'delete', accommodationId],
    mutationFn: (closureId: string) => closureApi.deleteClosure(closureId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['closure', 'get', accommodationId] }),
  });
};
