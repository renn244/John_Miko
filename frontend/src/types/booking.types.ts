import type statusOptions from "@/lib/constant/MY_BOOKING_STATUS.constants";
import type { Accommodation, AccommodationStayOption } from "./admin/accommodation.type";
import type { Feedback } from "./feedback.types";
import type { PaginationParams } from "./pagination.type";

export type BookingReportDocumentation = {
    id: string;
    title: string;
    description: string;
    proofImages: string[];
    type: 'checkIn' | 'checkOut';
    status: 'Pending' | 'Approved' | 'Rejected';
    severity: 'Low' | 'Medium' | 'High';
    createdAt: string;
    rejectionNote?: string | null;
    user: {
        id: string;
        name?: string | null;
        email: string;
        contactNo: string;
        role: string;
    };
}

export type Booking = {
    id: string;
    referenceCode: string | null;

    userId: string | null;
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
    stayOptionId: string;
    stayOptionCodeSnapshot: string;
    stayOptionLabelSnapshot: string;
    stayDurationHoursSnapshot?: number | null;
    guestFeeWaivedSnapshot: boolean;
    timeSlot?: string;
    stayOption?: AccommodationStayOption;
    paymentType: 'Partial' | 'Full';
    status: "Pending" | "Confirmed" | "Cancelled" | "Completed";

    createdAt: string;
    updatedAt: string;
}

export type BookingWithPaymentInfo = {
    paymentId: string;
    referenceNumber: string;
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

export type CreateManualBookingDto = {
    accommodationId: string;
    name: string;
    email: string;
    contactNo: string;
    adultGuests: number;
    seniorGuests: number;
    kidGuests: number;
    specialRequest?: string;
    proofImageUrl?: string;
    addOnServices?: {
        addOnServiceId: string;
        quantity: number;
    }[];
    preOrderItems?: {
        menuItemId: string;
        quantity: number;
    }[];
    checkIn: string;
    stayOptionId: string;
    paymentType: 'Partial' | 'Full';
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
    reports?: BookingReportDocumentation[];
} & BookingWithAccommodation

export type BookingWithAccommodationAndPreOrderAndPayment = {
    payment: {
        id: string,
        status: 'Pending' | 'Approved' | 'Rejected' | 'Refunded',
        referenceNumber?: string | null,
        proofImageUrl?: string | null,
        rejectionNote?: string | null,
        refundReason?: string | null,
        refundProofImageUrl?: string | null,
        refundedAt?: string | null,
        refundedBy?: {
            id: string,
            name?: string | null,
            email?: string | null,
        } | null,
        verifiedAt?: string | null,
        method?: {
            id: string,
            name: string,
            type: 'GCASH' | 'MAYA' | 'BANK' | 'CASH',
            accountName?: string | null,
            accountNumber?: string | null,
            instructions?: string | null,
            qrCodeUrl?: string | null,
        } | null,
        accommodationAmount: number,
        preOrderAmount: number,
        addOnAmount: number,
        guestFeeAmount: number,
        amountPaid: number,
        amountToPaid: number,
        totalAmount: number,
    }
} & BookingWithAccommodationAndPreOrder

export type BookingOverviewSummary = {
    id: string;
    referenceCode: string | null;
    guestName: string;
    bookingDate: string;
    stayOptionLabelSnapshot: string;
    stayOptionCodeSnapshot: string;
    paymentType: Booking['paymentType'];
    status: Booking['status'];
    createdAt: string;
    accommodation: {
        id: Accommodation['id'];
        name: Accommodation['name'];
        type: Accommodation['type'];
        imageUrl: Accommodation['imageUrl'];
    };
    payment?: {
        id: string;
        status: 'Pending' | 'Approved' | 'Rejected' | 'Refunded';
        amountPaid: number;
        amountToPaid: number;
        totalAmount: number;
    } | null;
}

export type BookingOverview = {
    todayCount: number;
    todaySchedule: BookingOverviewSummary[];
    upcomingBookings: BookingOverviewSummary[];
    recentBookings: BookingOverviewSummary[];
}

// My Booking Types
export type StatusOption = typeof statusOptions[number];
export type StateSelectedLabel = StatusOption["label"];
export type StateSelectedStatus = StatusOption["value"];
