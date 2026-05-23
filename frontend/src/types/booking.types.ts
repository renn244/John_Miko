import type statusOptions from "@/lib/constant/MY_BOOKING_STATUS.constants";
import type { Accommodation } from "./admin/accommodation.type";
import type { Feedback } from "./feedback.types";
import type { PaginationParams } from "./pagination.type";

export type Booking = {
    id: string;

    userId: string;
    accommodationId: string;

    guestName: string;
    email: string;
    contactNo: string;
    numberOfGuests: number;
    adultGuests?: number;
    kidGuests?: number;
    seniorGuest?: number;
    specialRequests?: string;

    bookingDate: string;
    timeSlot: "DayStay" | "OverNight"
    paymentType: 'Partial' | 'Full';
    status: "Pending" | "Confirmed" | "Cancelled" | "Completed";

    createdAt: string;
    updatedAt: string;
}

export type BookingWithPaymentInfo = {
    paymentId: string;
    checkoutUrl: string;
} & Booking

export type BookedAccommodation = {
    id: string;

    bookingId: string;

    name: Accommodation['name'];
    description: Accommodation['description'];
    imageUrl: Accommodation['imageUrl'];
    type: Accommodation['type'];
    price: Accommodation['price'];
    amenities: Accommodation['amenities'];

    createdAt: string;
}

// Query
export type GetBookingsQuery = {
    search?: string;
    status?: Booking['status'];
    paymentType?: Booking['paymentType'];
    accommodationId?: string;
    bookingDate?: Booking['bookingDate'];
}  & PaginationParams

// Response types
export type BookingWithAccommodation = {
    accommodation: {
        id: Accommodation['id'];
        name: Accommodation['name'];
        type: Accommodation['type'];
        imageUrl: Accommodation['imageUrl'];
    }
} & Booking

export type BookingWithAccommodationAndFeedback =  {
    feedback?: Feedback
} & BookingWithAccommodation

export type BookingWithAccommodationAndPreOrder = {
    preOrders?: {
        id: string;
        bookingId: string;
        name: string;
        description: string;
        category: string;
        price: number;
        quantity: number;
        createdAt: string;
    }[]
    addOns?: {
        id: string;
        bookingId: string;
        addOnServiceId: string;
        name: string;
        price: number;
        quantity: number;
        createdAt: string;
    }[]
    bookedAccommodation?: BookedAccommodation;
} & BookingWithAccommodation

export type BookingWithAccommodationAndPreOrderAndPayment = {
    payment: {
        id: string,
        paymentStatus: 'Pending' | 'Completed' | 'Failed',
        accommodationAmount: number,
        preOrderAmount: number,
        addOnAmount: number,
        guestFeeAmount: number,
        amountPaid: number,
        amountToPaid: number,
        totalAmount: number,
    }
} & BookingWithAccommodationAndPreOrder
// My Booking Types
export type StatusOption = typeof statusOptions[number];
export type StateSelectedLabel = StatusOption["label"];
export type StateSelectedStatus = StatusOption["value"];