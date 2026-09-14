export type KitchenOrderStatus = "Pending" | "Completed";

export type KitchenOrderItem = {
  id: string;
  name: string;
  quantity: number;
  status: KitchenOrderStatus;
};

export type KitchenOrder = {
  bookingId: string;
  referenceCode: string;
  guestName: string;
  email?: string;
  contactNo?: string;
  bookingDate: string;
  timeSlot?: string;
  startTime?: string | null;
  endTime?: string | null;
  kitchenStatus: KitchenOrderStatus;
  numberOfGuests?: number;
  notes?: string;
  items: KitchenOrderItem[];
};

export type GetKitchenOrdersQuery = {
  search?: string;
  date?: string;
  status?: KitchenOrderStatus;
};

export type UpdateKitchenItemStatusDto = {
  bookingId: string;
  itemId: string;
  status: KitchenOrderStatus;
};
