import apiClient from "@/lib/apiClient";
import { toast } from "@/lib/toast";
import type { GetKitchenOrdersQuery, KitchenOrder, KitchenOrderItem, KitchenOrderStatus } from "@/types/kitchenOrder.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type PreOrderListResponse = {
  bookingId: string;
  guestName: string;
  bookingDate: string;
  timeSlot?: "DayStay" | "OverNight";
  kitchenStatus?: KitchenOrderStatus;
  preOrders?: { id: string; name: string; quantity: number; status?: KitchenOrderStatus }[];
}[];

type PreOrderDetailsResponse = {
  bookingId: string;
  guestName: string;
  email?: string;
  contactNo?: string;
  bookingDate: string;
  timeSlot?: "DayStay" | "OverNight";
  kitchenStatus?: KitchenOrderStatus;
  numberOfGuests?: number;
  specialRequests?: string | null;
  preOrders?: { id: string; name: string; quantity: number; status?: KitchenOrderStatus }[];
};

type KitchenStatusMutationResponse = {
  message: string;
};

type UpdateKitchenItemStatusRequest = {
  bookingId: string;
  itemId: string;
  status: KitchenOrderStatus;
};

const mapItems = (items?: { id: string; name: string; quantity: number; status?: KitchenOrderStatus }[]): KitchenOrderItem[] => {
  return (items ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    status: item.status ?? "Pending",
  }));
};

const fetchKitchenOrders = async (query?: GetKitchenOrdersQuery) => {
  const response = await apiClient.get("/pre-order", {
    params: {
      search: query?.search || undefined,
      date: query?.date || undefined,
    } satisfies GetKitchenOrdersQuery,
  });

  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to fetch pre-orders");
  }

  const data = response.data as PreOrderListResponse;

  return (data ?? []).map(
    (booking): KitchenOrder => ({
      bookingId: booking.bookingId,
      guestName: booking.guestName,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
      kitchenStatus: booking.kitchenStatus,
      items: mapItems(booking.preOrders),
    })
  );
};

const fetchKitchenOrderDetails = async (bookingId: string) => {
  const response = await apiClient.get(`/pre-order/${bookingId}`);

  if (response.status === 404) {
    return null;
  }

  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to fetch pre-order details");
  }

  const data = response.data as PreOrderDetailsResponse;

  return {
    bookingId: data.bookingId,
    guestName: data.guestName,
    email: data.email,
    contactNo: data.contactNo,
    bookingDate: data.bookingDate,
    timeSlot: data.timeSlot,
    kitchenStatus: data.kitchenStatus,
    numberOfGuests: data.numberOfGuests,
    notes: data.specialRequests ?? undefined,
    items: mapItems(data.preOrders),
  } satisfies KitchenOrder;
};

export const useKitchenOrders = (query?: GetKitchenOrdersQuery) => {
  return useQuery({
    queryKey: ["kitchen", "orders", query],
    queryFn: () => fetchKitchenOrders(query),
    staleTime: 15_000,
  });
};

export const useKitchenOrderById = (orderId?: string) => {
  return useQuery({
    queryKey: ["kitchen", "order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      return await fetchKitchenOrderDetails(orderId);
    },
    enabled: Boolean(orderId),
    staleTime: 15_000,
  });
};

export const useUpdateKitchenItemStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["kitchen", "item-status"],
    mutationFn: async ({ bookingId, itemId, status }: UpdateKitchenItemStatusRequest) => {
      const response = await apiClient.patch(`/pre-order/${itemId}/status`, {
        status,
      });

      if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to update item status");
      }

      return response.data as KitchenStatusMutationResponse;
    },
    onSuccess: async (data, variables) => {
      toast.success(data.message || "Item status updated.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["kitchen", "order", variables.bookingId] }),
        queryClient.invalidateQueries({ queryKey: ["kitchen", "orders"] }),
      ]);
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });
};

export const useCompleteAllKitchenItemsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["kitchen", "complete-all-items"],
    mutationFn: async (bookingId: string) => {
      const response = await apiClient.patch(`/pre-order/${bookingId}/status/complete-all`);

      if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to complete all items");
      }

      return response.data as KitchenStatusMutationResponse;
    },
    onSuccess: async (data, bookingId) => {
      toast.success(data.message || "All items marked as completed.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["kitchen", "order", bookingId] }),
        queryClient.invalidateQueries({ queryKey: ["kitchen", "orders"] }),
      ]);
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });
};
