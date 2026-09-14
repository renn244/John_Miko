import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Booking } from "@/features/shared/bookings/types/booking.type";
import { getBookingStatusDisplay } from "./bookingDisplay";

const BookingStatusBadge = ({
    status,
    className,
}: {
    status: Booking["status"];
    className?: string;
}) => (
    <Badge
        variant="outline"
        className={cn("shadow-none", getBookingStatusDisplay(status).badgeClassName, className)}
    >
        {status}
    </Badge>
);

export default BookingStatusBadge;
