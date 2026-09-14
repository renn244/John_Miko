import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { BookingWithAccommodationAndPreOrderAndPayment } from "@/features/shared/bookings/types/booking.type";
import getCheckInOut from "@/lib/getCheckInOut";
import { Calendar, Clock3, Users } from "lucide-react";

type BookingInformationCardProps = {
    booking: BookingWithAccommodationAndPreOrderAndPayment;
};

const BookingInformationCard = ({ booking }: BookingInformationCardProps) => {
    const { checkIn, checkOut } = getCheckInOut({
        bookingDate: booking.bookingDate,
        startTime: booking.stayOption?.startTime,
        endTime: booking.stayOption?.endTime,
        label: booking.stayOption?.label ?? booking.stayOptionLabelSnapshot,
    });
    const accommodation = booking.bookedAccommodation ?? booking.accommodation;
    const accommodationName = accommodation?.name ?? "Accommodation";
    const accommodationType = accommodation?.type ?? "Type unavailable";
    const accommodationImage = accommodation?.imageUrl;
    const stayOptionLabel =
        booking.stayOption?.label ?? booking.stayOptionLabelSnapshot;
    const stayLabel = stayOptionLabel ?? booking.timeSlot ?? "Stay";
    const metrics = [
        { label: "Check-in", value: checkIn, Icon: Calendar },
        { label: "Check-out", value: checkOut, Icon: Clock3 },
        {
            label: "Guest Count",
            value: `${booking.numberOfGuests} ${booking.numberOfGuests === 1 ? "person" : "people"}`,
            Icon: Users,
        },
    ];

    return (
        <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-foreground md:text-lg">
                    Booking Information
                </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
                {accommodationImage ? (
                    <img
                        src={accommodationImage}
                        alt={accommodationName}
                        className="h-36 w-full rounded-xl border object-cover sm:h-32 sm:w-48"
                    />
                ) : (
                    <div className="h-36 w-full rounded-xl border bg-muted sm:h-32 sm:w-48" />
                )}
                <div className="min-w-0 flex-1">
                    <div className="min-w-0">
                        <h2 className="truncate text-xl font-semibold tracking-tight">
                            {accommodationName}
                        </h2>
                        <p className="mt-1 break-all text-sm text-muted-foreground">
                            Booking Reference: {booking.referenceCode ?? "N/A"}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge
                                variant="outline"
                                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                            >
                                {accommodationType}
                            </Badge>
                            <Badge className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                                {stayLabel}
                            </Badge>
                        </div>
                    </div>
                    <div className="mt-4 border-t pt-4">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {metrics.map(({ label, value, Icon }) => (
                                <div key={label} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Icon className="size-3.5 text-muted-foreground/80" />
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {label}
                                        </p>
                                    </div>
                                    <div className="pl-5 text-sm font-medium text-foreground">
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default BookingInformationCard;
