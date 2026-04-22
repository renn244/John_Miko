import type statusOptions from "@/lib/constant/MY_BOOKING_STATUS.constants";
import type { Accommodation } from "./admin/accommodation.type";
import type { Feedback } from "./feedback.types";

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
    timeSlot: "DayStay" | "OverNight"
    paymentType: 'Partial' | 'Full';
    status: "Pending" | "Confirmed" | "Cancelled" | "Completed";

    createdAt: string;
    updatedAt: string;
}

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
} & BookingWithAccommodation

// My Booking Types
export type StatusOption = typeof statusOptions[number];
export type StateSelectedLabel = StatusOption["label"];
export type StateSelectedStatus = StatusOption["value"];