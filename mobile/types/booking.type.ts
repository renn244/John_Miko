import type { PaginationParams } from "@/types/pagination.type";

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";
export type BookingTimeSlot = "DayStay" | "OverNight";
export type PaymentType = "Partial" | "Full";

export type Booking = {
  id: string;
  userId: string;
  accommodationId: string;
  guestName: string;
  email: string;
  contactNo: string;
  numberOfGuests: number;
  specialRequests?: string;
  bookingDate: string;
  timeSlot: BookingTimeSlot;
  paymentType: PaymentType;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};

export type GetBookingsQuery = {
  search?: string;
  status?: BookingStatus;
  paymentType?: PaymentType;
  accommodationId?: string;
  bookingDate?: string;
} & PaginationParams;

export type BookingWithAccommodation = Booking & {
  accommodation: {
    id: string;
    name: string;
    type: string;
    imageUrl: string;
  };
};

export type PreOrderItem = {
  id: string;
  bookingId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  createdAt: string;
};

export type BookingWithAccommodationAndPreOrder = BookingWithAccommodation & {
  preOrders?: PreOrderItem[];
};
