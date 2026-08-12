import { staffKitchenApi } from "@/api/staff/kitchen-order.api";
import type { GetKitchenOrdersQuery } from "@/types/staff/kitchen-order.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const invalidateKitchenOrders = (
  queryClient: ReturnType<typeof useQueryClient>,
  bookingId?: string,
) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ["staff", "kitchen", "orders"] }),
    ...(bookingId
      ? [
          queryClient.invalidateQueries({
            queryKey: ["staff", "kitchen", "order", bookingId],
          }),
        ]
      : []),
  ]);

export const useKitchenOrders = (query: GetKitchenOrdersQuery) =>
  useQuery({
    queryKey: ["staff", "kitchen", "orders", query],
    queryFn: () => staffKitchenApi.getOrders(query),
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });

export const useKitchenOrderById = (bookingId?: string) =>
  useQuery({
    queryKey: ["staff", "kitchen", "order", bookingId],
    queryFn: () => staffKitchenApi.getOrderById(bookingId || ""),
    enabled: Boolean(bookingId),
    staleTime: 15_000,
    refetchOnWindowFocus: false,
    retry: false,
  });

export const useUpdateKitchenItemStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staffKitchenApi.updateItemStatus,
    onSuccess: async (response, variables) => {
      toast.success(response.message || "Meal item updated.");
      await invalidateKitchenOrders(queryClient, variables.bookingId);
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useCompleteAllKitchenItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staffKitchenApi.completeAll,
    onSuccess: async (response, bookingId) => {
      toast.success(response.message || "All meal items marked as completed.");
      await invalidateKitchenOrders(queryClient, bookingId);
    },
    onError: (error) => toast.error(error.message),
  });
};
