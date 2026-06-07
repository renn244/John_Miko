import type { BookingTimeSlot } from "@/types/booking.type";

export type KitchenOrderStatus =
    | "Pending"
    | "Completed";

export type KitchenOrderItem = {
    id: string;
    name: string;
    quantity: number;
    status: KitchenOrderStatus;
};

// Kitchen view is booking-centric: one booking can contain many pre-order items.
export type KitchenOrder = {
    bookingId: string;
    guestName: string;
    email?: string;
    contactNo?: string;
    bookingDate: string;
    timeSlot?: BookingTimeSlot;
    kitchenStatus?: KitchenOrderStatus;
    numberOfGuests?: number;
    notes?: string;
    items: KitchenOrderItem[];
};

export type GetKitchenOrdersQuery = {
    search?: string;
    date?: string; // YYYY-MM-DD
};
