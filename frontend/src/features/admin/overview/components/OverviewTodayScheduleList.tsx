import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Button } from "@/components/ui/button";
import BookingStatusBadge from "@/features/admin/bookings/components/BookingStatusBadge";
import { getBookingStatusDisplay } from "@/features/admin/bookings/components/bookingDisplay";
import { cn } from "@/lib/utils";
import type { BookingOverviewSummary } from "@/features/shared/bookings/types/booking.type";
import { Link } from "react-router";
import {
    EmptyState,
    StatusBadge,
    formatDate,
} from "./Overview.shared";

const OverviewTodayScheduleList = ({
    bookings,
    isLoading,
}: {
    bookings: BookingOverviewSummary[];
    isLoading: boolean;
}) => {
    if (isLoading) {
        return (
            <div className="p-4">
                <LoadingSpinner
                    className="size-5"
                    containerClassName="justify-start"
                />
            </div>
        );
    }

    if (!bookings.length) {
        return (
            <div className="p-4">
                <EmptyState message="No active bookings scheduled for this date." />
            </div>
        );
    }

    return (
        <div className="divide-y divide-border/70">
            <div className="hidden grid-cols-[1.15fr_1.35fr_1.3fr_1fr_0.9fr_0.9fr_0.6fr] gap-4 bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
                <span>Reference</span>
                <span>Guest</span>
                <span>Accommodation</span>
                <span>Stay</span>
                <span>Payment</span>
                <span>Status</span>
                <span className="text-right">Action</span>
            </div>
            {bookings.map((booking) => (
                <div
                    key={booking.id}
                    className={cn(
                        "grid gap-3 border-l-[3px] px-4 py-3 pl-[13px] text-sm transition-colors hover:bg-primary/[0.03] md:grid-cols-[1.15fr_1.35fr_1.3fr_1fr_0.9fr_0.9fr_0.6fr] md:items-center md:gap-4",
                        getBookingStatusDisplay(booking.status).accentBorderClassName,
                    )}
                >
                    <div>
                        <p className="font-medium text-foreground">
                            {booking.referenceCode || booking.id}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground md:hidden">
                            {formatDate(booking.bookingDate)}
                        </p>
                    </div>
                    <p className="min-w-0 truncate text-foreground">{booking.guestName}</p>
                    <div className="min-w-0">
                        <p className="truncate text-foreground">
                            {booking.accommodation.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {booking.accommodation.type}
                        </p>
                    </div>
                    <p className="text-muted-foreground">
                        {booking.stayOptionLabelSnapshot}
                    </p>
                    <StatusBadge value={booking.payment?.status} />
                    <BookingStatusBadge status={booking.status} />
                    <Button
                        asChild
                        variant="link"
                        size="sm"
                        className="min-h-8 justify-start px-2 text-xs md:justify-end"
                    >
                        <Link to={`/admin/booking/${booking.id}`}>View</Link>
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default OverviewTodayScheduleList;
