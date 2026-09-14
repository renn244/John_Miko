import { Card } from "@/components/ui/card";
import type { BookingWithAccommodationAndPreOrderAndPayment } from "@/features/shared/bookings/types/booking.type";
import { formatPeso } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

type PaymentSummaryCardProps = {
    booking: BookingWithAccommodationAndPreOrderAndPayment;
    addOnAmount: number;
    preOrderAmount: number;
};

const PaymentSummaryCard = ({
    booking,
    addOnAmount,
    preOrderAmount,
}: PaymentSummaryCardProps) => {
    const payment = booking.payment;
    const items = payment
        ? [
              {
                  label: "Accommodation",
                  value: formatPeso(payment.accommodationAmount),
              },
              { label: "Guest Fee", value: formatPeso(payment.guestFeeAmount) },
              { label: "Add-ons", value: formatPeso(addOnAmount) },
              { label: "Pre-orders", value: formatPeso(preOrderAmount) },
          ]
        : [];
    return (
        <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-foreground md:text-lg">
                    Payment Summary
                </h2>
            </div>
            {payment ? (
                <div className="space-y-4">
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center justify-between gap-3 text-sm"
                            >
                                <span className="text-muted-foreground">
                                    {item.label}
                                </span>
                                <span className="font-medium text-foreground">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="font-semibold text-foreground">
                                Total
                            </span>
                            <span className="font-semibold text-foreground">
                                {formatPeso(payment.totalAmount)}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
                        <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-muted-foreground">
                                Amount Paid
                            </span>
                            <span className="text-emerald-700">
                                {formatPeso(payment.amountPaid)}
                            </span>
                        </div>
                        <div className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-semibold text-primary">
                                    Balance Due
                                </span>
                                <span className="text-xl font-bold text-primary">
                                    {formatPeso(payment.amountToPaid)}
                                </span>
                            </div>
                        </div>
                        {booking.paymentType === "Full" &&
                            payment.amountToPaid === 0 && (
                                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                                    <CheckCircle className="size-4" />
                                    Fully paid
                                </div>
                            )}
                    </div>
                </div>
            ) : (
                <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-5 text-sm text-muted-foreground">
                    Payment summary will appear here once a payment record is
                    available for this booking.
                </div>
            )}
        </Card>
    );
};

export default PaymentSummaryCard;
