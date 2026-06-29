import { GuestCard, GuestDivider } from "@/components/guest";
import { Button } from "@/components/ui/button";
import { formatPeso } from "@/lib/utils";
import type { Accommodation } from "@/types/admin/accommodation.type";
import type { BookingWithPaymentInfo } from "@/types/booking.types";
import { CheckCircle } from "lucide-react";

export type BookingConfirmationSummary = {
    guestName: string;
    email: string;
    contactNo: string;
    stayType: string;
    checkIn: Date;
    checkOut: Date;
    paymentType: "Full" | "Partial";
    total: number;
    amountPaid: number;
    amountToPayLater: number;
};

type BookingConfirmationProps = {
    accommodation: Accommodation;
    summary: BookingConfirmationSummary;
    booking: BookingWithPaymentInfo;
    backToHome: () => void;
    viewMyBookings: () => void;
};

const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const SummaryItem = ({ label, value }: { label: string; value: string | number }) => (
    <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
        </p>
        <p className="mt-1 font-semibold">{value}</p>
    </div>
);

const BookingConfirmation = ({
    accommodation,
    summary,
    booking,
    backToHome,
    viewMyBookings,
}: BookingConfirmationProps) => {
    const guestBreakdown = [
        booking.adultGuests
            ? `${booking.adultGuests} adult${booking.adultGuests > 1 ? "s" : ""}`
            : null,
        booking.seniorGuest
            ? `${booking.seniorGuest} senior${booking.seniorGuest > 1 ? "s" : ""}`
            : null,
        booking.kidGuests
            ? `${booking.kidGuests} kid${booking.kidGuests > 1 ? "s" : ""}`
            : null,
    ].filter(Boolean).join(", ") || `${booking.numberOfGuests} guest${booking.numberOfGuests > 1 ? "s" : ""}`;

    return (
        <div className="flex justify-center py-8 md:py-12">
            <GuestCard padded={false} className="w-full max-w-2xl overflow-hidden border-t-4 border-t-primary">
                <div className="px-5 py-7 text-center md:px-8">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <CheckCircle className="size-7" />
                    </div>
                    <h2 className="mt-5 text-2xl font-bold tracking-normal">
                        Payment Submitted
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        Your booking is pending verification. We will confirm your reservation once your payment proof has been reviewed by our team.
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Ref #
                        </span>
                        <span className="font-bold">{booking.referenceNumber}</span>
                    </div>
                </div>

                <div className="px-5 pb-5 md:px-8 md:pb-8">
                    <div className="rounded-lg border bg-muted/20 p-4 md:p-5">
                        <h3 className="text-lg font-bold tracking-normal">Booking Summary</h3>
                        <GuestDivider className="my-4" />

                        <div className="grid gap-4 text-sm sm:grid-cols-2">
                            <SummaryItem label="Accommodation" value={accommodation.name} />
                            <SummaryItem label="Stay Type" value={summary.stayType} />
                            <SummaryItem
                                label="Dates"
                                value={`${formatDate(summary.checkIn)} - ${formatDate(summary.checkOut)}`}
                            />
                            <SummaryItem label="Guests" value={guestBreakdown} />
                        </div>

                        <GuestDivider className="my-4" />

                        <div className="grid gap-4 text-sm sm:grid-cols-2">
                            <SummaryItem label="Payment Type" value={`${summary.paymentType} Payment`} />
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Paid Amount
                                    </span>
                                    <span className="font-bold">{formatPeso(summary.amountPaid)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Balance Due
                                    </span>
                                    <span className="font-bold text-primary">
                                        {formatPeso(summary.amountToPayLater)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-sm leading-6 text-muted-foreground">
                        Keep your reference number handy. You can track verification status from My Bookings.
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <Button variant="outline" onClick={() => backToHome()}>
                            Back to Home
                        </Button>
                        <Button onClick={() => viewMyBookings()}>
                            View My Bookings
                        </Button>
                    </div>
                </div>
            </GuestCard>
        </div>
    );
};

export default BookingConfirmation;
