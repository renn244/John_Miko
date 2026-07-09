import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetBookingOverviewQuery } from "@/hooks/admin/booking.hook";
import { formatToSmartDate } from "@/lib/date.util";
import type { BookingOverviewSummary } from "@/types/booking.types";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import {
    EmptyState,
    SectionHeader,
    StatusBadge,
    formatDate,
    getBookingRowAccent,
    surfaceClassName,
} from "./Overview.shared";

const OverviewRecentBookingsCard = ({
    selectedDate,
}: {
    selectedDate: string;
}) => {
    const bookingOverview = useGetBookingOverviewQuery(selectedDate);
    const bookings = bookingOverview.data?.recentBookings ?? [];

    return (
        <div className={`${surfaceClassName} p-4`}>
            <SectionHeader
                title="Recent Bookings"
                linkTo="/admin/booking"
                linkLabel="View all"
            />
            <div className="mt-4">
                {bookingOverview.isLoading ? (
                    <LoadingSpinner
                        className="size-5"
                        containerClassName="justify-start"
                    />
                ) : bookings.length ? (
                    <div className="divide-y divide-border/70">
                        {bookings.map((booking) => (
                            <RecentBookingsCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                ) : (
                    <EmptyState message="No recent bookings found." />
                )}
            </div>
        </div>
    );
};

const RecentBookingsCard = ({ booking }: { booking: BookingOverviewSummary }) => {
    return (
        <Link
            to={`/admin/booking/${booking.id}`}
            className="group relative block min-h-[84px] py-3 pl-4 pr-1 transition-colors last:pb-0 hover:bg-muted/20"
        >
            <span
                className="absolute bottom-2 left-0 top-2 w-1 rounded-full"
                style={{
                    backgroundColor: getBookingRowAccent(
                        booking.status,
                    ),
                }}
            />
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                        {booking.guestName}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                        {booking.accommodation.name} -{" "}
                        {formatDate(booking.bookingDate)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {booking.referenceCode || booking.id}
                    </p>
                </div>
                <div className="flex shrink-0 items-start gap-2">
                    <div className="flex flex-col items-end justify-between gap-4">
                        <span className="text-xs text-muted-foreground">
                            {formatToSmartDate(booking.createdAt)}
                        </span>
                        <StatusBadge value={booking.status} />
                    </div>
                    <ArrowRight className="mt-0.5 size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
            </div>
        </Link>
    )
}

export default OverviewRecentBookingsCard;