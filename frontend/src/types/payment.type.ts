import type { PaymentMethod } from "@/types/payment-method.type";
import type { AccommodationStayOption } from "./admin/accommodation.type";

export type PaymentStatus = 'Pending' | 'Approved' | 'Rejected' | 'Refunded';

export type PaymentRecord = {
    id: string;
    bookingId: string;
    status: PaymentStatus;
    referenceNumber?: string | null;
    proofImageUrl?: string | null;
    rejectionNote?: string | null;
    refundReason?: string | null;
    refundProofImageUrl?: string | null;
    refundedAt?: string | null;
    verifiedAt?: string | null;
    paidAt?: string | null;
    accommodationAmount: number;
    preOrderAmount: number;
    addOnAmount: number;
    guestFeeAmount: number;
    amountPaid: number;
    amountToPaid: number;
    totalAmount: number;
    createdAt: string;
    method?: PaymentMethod | null;
    booking: {
        id: string;
        bookingDate: string;
        timeSlot: string;
        stayOption?: AccommodationStayOption;
        guestName: string;
        email: string;
        contactNo: string;
        status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
        accommodation: {
            id: string;
            name: string;
            type: string;
            imageUrl: string;
        };
    };
    verifiedBy?: {
        id: string;
        name?: string | null;
        email?: string | null;
    } | null;
    refundedBy?: {
        id: string;
        name?: string | null;
        email?: string | null;
    } | null;
};
