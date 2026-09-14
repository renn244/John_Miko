import apiClient from "@/lib/apiClient";
import type {
  GetKitchenOrdersQuery,
  KitchenOrder,
  KitchenOrderItem,
  KitchenOrderStatus,
  UpdateKitchenItemStatusDto,
} from "@/features/staff/kitchen/types/staffKitchen.type";

type ApiPreOrder = {
  id: string;
  name: string;
  quantity: number;
  status?: KitchenOrderStatus;
};

type ApiKitchenOrder = {
  bookingId: string;
  referenceCode: string;
  guestName: string;
  email?: string;
  contactNo?: string;
  bookingDate: string;
  timeSlot?: string;
  startTime?: string | null;
  endTime?: string | null;
  numberOfGuests?: number;
  specialRequests?: string | null;
  preOrders?: ApiPreOrder[];
};

const mapItems = (items: ApiPreOrder[] = []): KitchenOrderItem[] =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    status: item.status ?? "Pending",
  }));

const getStatus = (items: KitchenOrderItem[]): KitchenOrderStatus =>
  items.length > 0 && items.every((item) => item.status === "Completed")
    ? "Completed"
    : "Pending";

const mapOrder = (order: ApiKitchenOrder): KitchenOrder => {
  const items = mapItems(order.preOrders);
  return {
    bookingId: order.bookingId,
    referenceCode: order.referenceCode,
    guestName: order.guestName,
    email: order.email,
    contactNo: order.contactNo,
    bookingDate: order.bookingDate,
    timeSlot: order.timeSlot,
    startTime: order.startTime,
    endTime: order.endTime,
    numberOfGuests: order.numberOfGuests,
    notes: order.specialRequests ?? undefined,
    kitchenStatus: getStatus(items),
    items,
  };
};

export const staffKitchenApi = {
  getOrders: async (query: GetKitchenOrdersQuery) => {
    const response = await apiClient.get("/pre-order", { params: query });
    if (response.status >= 400)
      throw new Error(response.data?.message || "Could not load pre-orders.");
    return ((response.data as ApiKitchenOrder[]) ?? []).map(mapOrder);
  },
  getOrderById: async (bookingId: string) => {
    const response = await apiClient.get(`/pre-order/${bookingId}`);
    if (response.status === 404) return null;
    if (response.status >= 400)
      throw new Error(
        response.data?.message || "Could not load this kitchen order.",
      );
    return mapOrder(response.data as ApiKitchenOrder);
  },
  updateItemStatus: async ({ itemId, status }: UpdateKitchenItemStatusDto) => {
    const response = await apiClient.patch(`/pre-order/${itemId}/status`, {
      status,
    });
    if (response.status >= 400)
      throw new Error(
        response.data?.message || "Could not update this meal item.",
      );
    return response.data as { message?: string };
  },
  completeAll: async (bookingId: string) => {
    const response = await apiClient.patch(
      `/pre-order/${bookingId}/status/complete-all`,
    );
    if (response.status >= 400)
      throw new Error(
        response.data?.message || "Could not complete every meal item.",
      );
    return response.data as { message?: string };
  },
};
