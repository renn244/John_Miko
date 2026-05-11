type NumericLike = number | string;

// Raw response shape from `GET /payment/revenue-analytics`.
// Note: unquoted SQL aliases are folded to lowercase in Postgres.
export type RevenueAnalyticsApiItem = {
    month: string; // "YYYY-MM"
    count: NumericLike;
    totalamount: NumericLike;
    accommodationamount: NumericLike;
    preorderamount: NumericLike;
    guestfeeamount: NumericLike;
};
