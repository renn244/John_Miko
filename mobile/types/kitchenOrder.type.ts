import type { BookingTimeSlot } from "@/types/booking.type";

export type KitchenOrderItem = {
    id: string;
    name: string;
    quantity: number;
};

// Kitchen view is booking-centric: one booking can contain many pre-order items.
export type KitchenOrder = {
    orderId: string; // currently equals bookingId
    bookingId: string;
    guestName: string;
    email?: string;
    contactNo?: string;
    bookingDate: string;
    timeSlot?: BookingTimeSlot;
    numberOfGuests?: number;
    notes?: string;
    items: KitchenOrderItem[];
};

export type GetKitchenOrdersQuery = {
    search?: string;
    date?: string; // YYYY-MM-DD
};
