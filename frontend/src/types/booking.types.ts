import type { Accommodation } from "./admin/accommodation.type";

export type Booking = {
    id: string;

    userId: string;
    accommodationId: string;

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
        name: Accommodation['name'];
        type: Accommodation['type'];
        imageUrl: Accommodation['imageUrl'];
    }
} & Booking

