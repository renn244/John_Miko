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
