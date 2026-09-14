import type { PaymentMethod } from "@/features/shared/payment-methods/types/payment-method.type";
import type { AccommodationStayOption } from "@/features/shared/accommodations/types/accommodation.type";

type NumericLike = number | string;

export type PaymentReportBreakdown = {
    accommodationFee: number;
    preOrderFee: number;
    addOnServiceFee: number;
    guestFee: number;
    privateClosureRevenue: number;
    totalRevenue: number;
};

// Raw response shape from `GET /payment/revenue-analytics`.
// Note: unquoted SQL aliases are folded to lowercase in Postgres.
export type RevenueAnalyticsApiItem = {
    month: string; // "YYYY-MM"
    count: NumericLike;
    totalamount: NumericLike;
    accommodationamount: NumericLike;
    preorderamount: NumericLike;
    addonamount: NumericLike;
    guestfeeamount: NumericLike;
    privateclosurerevenueamount: NumericLike;
};

export type PaymentOverviewRecord = {
    id: string;
    bookingId: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Refunded';
    referenceNumber?: string | null;
    proofImageUrl?: string | null;
    amountPaid: number;
    amountToPaid: number;
    totalAmount: number;
    createdAt: string;
    method?: {
        id: string;
        name: string;
        type: 'GCASH' | 'MAYA' | 'BANK' | 'CASH';
    } | null;
    booking: {
        id: string;
        referenceCode: string | null;
        guestName: string;
        bookingDate: string;
        stayOptionLabelSnapshot: string;
        status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
        accommodation: {
            id: string;
            name: string;
            type: string;
            imageUrl: string;
        };
    };
};

export type PaymentOverview = {
    todayRevenue: number;
    pendingReviewCount: number;
    pendingPayments: PaymentOverviewRecord[];
    revenueBreakdown: PaymentReportBreakdown;
};

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
