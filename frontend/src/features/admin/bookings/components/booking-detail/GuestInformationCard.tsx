import { Card } from "@/components/ui/card";
import type { BookingWithAccommodationAndPreOrderAndPayment } from "@/features/shared/bookings/types/booking.type";
import { FileText, Mail, Phone } from "lucide-react";

type GuestInformationCardProps = {
    booking: BookingWithAccommodationAndPreOrderAndPayment;
};

const GuestInformationCard = ({ booking }: GuestInformationCardProps) => {
    const guestBreakdown = `${booking.adultGuests ?? 0} adult${(booking.adultGuests ?? 0) === 1 ? "" : "s"}, ${booking.seniorGuest ?? 0} senior${(booking.seniorGuest ?? 0) === 1 ? "" : "s"}, ${booking.kidGuests ?? 0} child${(booking.kidGuests ?? 0) === 1 ? "" : "ren"}`;
    return (
        <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-foreground md:text-lg">
                    Guest Information
                </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Detail label="Primary Guest">{booking.guestName}</Detail>
                <Detail label="Contact Email">
                    <a
                        href={`mailto:${booking.email}`}
                        className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                    >
                        <Mail className="size-4 text-muted-foreground" />
                        <span className="break-all">{booking.email}</span>
                    </a>
                </Detail>
                <Detail label="Phone Number">
                    <a
                        href={`tel:${booking.contactNo}`}
                        className="inline-flex items-center gap-2 font-medium text-foreground hover:text-primary"
                    >
                        <Phone className="size-4 text-muted-foreground" />
                        {booking.contactNo}
                    </a>
                </Detail>
                <Detail label="Guests">
                    {booking.numberOfGuests}{" "}
                    {booking.numberOfGuests === 1 ? "guest" : "guests"}
                </Detail>
                <div className="md:col-span-2">
                    <Detail label="Guest Breakdown">{guestBreakdown}</Detail>
                </div>
            </div>
            {booking.specialRequests && (
                <div className="mt-5 border-t pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Special Requests
                    </p>
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        <div className="flex items-start gap-3">
                            <FileText className="mt-0.5 size-4 shrink-0 text-amber-700" />
                            <p className="leading-6">
                                {booking.specialRequests}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

const Detail = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
        </p>
        <div className="mt-1 text-sm font-medium text-foreground">
            {children}
        </div>
    </div>
);

export default GuestInformationCard;
