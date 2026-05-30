import apiClient from "@/lib/apiClient";
import type { GetKitchenOrdersQuery, KitchenOrder, KitchenOrderItem } from "@/types/kitchenOrder.type";
import { useQuery } from "@tanstack/react-query";

type PreOrderListResponse = Array<{
  id: string;
  guestName: string;
  bookingDate: string;
  timeSlot?: "DayStay" | "OverNight";
  preOrders?: Array<{ id: string; name: string; quantity: number }>;
}>;

type PreOrderDetailsResponse = {
  id: string;
  guestName: string;
  email?: string;
  contactNo?: string;
  contnatNo?: string;
  bookingDate: string;
  timeSlot?: "DayStay" | "OverNight";
  numberOfGuests?: number;
  specialRequests?: string;
  preOrders?: Array<{ id: string; name: string; quantity: number }>;
};

const mapItems = (items?: Array<{ id: string; name: string; quantity: number }>): KitchenOrderItem[] => {
  return (items ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
  }));
};

const fetchKitchenOrders = async (query?: GetKitchenOrdersQuery) => {
  const response = await apiClient.get("/pre-order", {
    params: {
      search: query?.search || undefined,
      date: query?.date || undefined,
    } satisfies GetKitchenOrdersQuery,
  });

  console.log(response.data)

  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to fetch pre-orders");
  }

  const data = response.data as PreOrderListResponse;

  return (data ?? []).map(
    (booking): KitchenOrder => ({
      orderId: booking.id,
      bookingId: booking.id,
      guestName: booking.guestName,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
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
    orderId: data.id,
    bookingId: data.id,
    guestName: data.guestName,
    email: data.email,
    contactNo: data.contactNo ?? data.contnatNo,
    bookingDate: data.bookingDate,
    timeSlot: data.timeSlot,
    numberOfGuests: data.numberOfGuests,
    notes: data.specialRequests,
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
