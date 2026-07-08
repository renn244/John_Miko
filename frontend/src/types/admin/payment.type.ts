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
    status: 'Pending' | 'Approved' | 'Rejected';
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
