import AdminTableEmptyState from "@/components/common/AdminTableEmptyState";
import DataPagination from "@/components/common/DataPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetBookingsAdminQuery } from "@/features/admin/bookings/hooks/useAdminBookings";
import { useBookingSearch } from "@/features/admin/bookings/hooks/useBookingSearch";
import { useBookingAdminStore } from "@/features/admin/bookings/store/bookingAdmin.store";
import type { GetBookingsQuery } from "@/features/shared/bookings/types/booking.type";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarSync, CircleCheck, CircleX, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import BookingStatusBadge from "./BookingStatusBadge";
import { getBookingStatusDisplay } from "./bookingDisplay";

const getPaymentTypeColor = (paymentType: string) => {
    switch (paymentType) {
        case "Full":
            return { bg: "#D1FAE5", text: "#059669" };
        case "Partial":
            return { bg: "#FEF3C7", text: "#D97706" };
        default:
            return { bg: "#F3F4F6", text: "#6B7280" };
    }
};

const BookingTable = () => {
    const setRescheduleBookingId = useBookingAdminStore((state) => state.setRescheduleBookingId);
    const setMarkCompletedBookingId = useBookingAdminStore((state) => state.setMarkCompletedBookingId);
    const setMarkCancelBookingId = useBookingAdminStore((state) => state.setMarkCancelBookingId);
    const navigate = useNavigate();

    const {
        search,
        status,
        paymentType,
        accommodationId,
        bookingDate,
        page,
        limit,
        updatePage,
    } = useBookingSearch();

    const { data, isLoading } = useGetBookingsAdminQuery({
        search,
        accommodationId,
        bookingDate,
        page,
        limit,
        status: status as GetBookingsQuery["status"],
        paymentType: paymentType as GetBookingsQuery["paymentType"],
    });

    if (isLoading) {
        return (
            <div className="flex min-h-72 items-center justify-center p-6">
                <LoadingSpinner className="size-8" />
            </div>
        );
    }

    const bookings = data?.data ?? [];
    const meta = data?.meta;
    const hasActiveFilters = Boolean(search || status || paymentType || accommodationId || bookingDate);

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="space-y-3 p-3 md:hidden">
                {bookings.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        {hasActiveFilters ? "No bookings found for the current filters." : "No bookings yet."}
                    </p>
                ) : bookings.map((booking) => {
                    const statusDisplay = getBookingStatusDisplay(booking.status);
                    const paymentTypeColor = getPaymentTypeColor(booking.paymentType);
                    const hasRowActions = booking.status === "Confirmed";

                    return (
                        <article
                            key={booking.id}
                            className={cn(
                                "rounded-xl border border-l-[3px] bg-card p-4 shadow-sm",
                                statusDisplay.accentBorderClassName,
                            )}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate font-semibold tracking-tight">{booking.referenceCode ?? "N/A"}</p>
                                    <p className="mt-1 truncate text-sm text-muted-foreground">{booking.guestName}</p>
                                </div>
                                <BookingStatusBadge status={booking.status} className="shrink-0" />
                            </div>

                            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y py-3 text-sm">
                                <div className="min-w-0">
                                    <dt className="text-xs text-muted-foreground">Accommodation</dt>
                                    <dd className="mt-1 truncate font-medium">{booking.accommodation.name}</dd>
                                    <dd className="text-xs text-muted-foreground">{booking.accommodation.type}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">Date</dt>
                                    <dd className="mt-1 font-medium">{format(new Date(booking.bookingDate), "MMM dd, yyyy")}</dd>
                                </div>
                                <div className="min-w-0">
                                    <dt className="text-xs text-muted-foreground">Stay</dt>
                                    <dd className="mt-1 truncate font-medium">
                                        {booking.stayOption?.label ?? booking.stayOptionLabelSnapshot ?? booking.timeSlot ?? "Stay"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">Payment</dt>
                                    <dd className="mt-1">
                                        <Badge style={{ backgroundColor: paymentTypeColor.bg, color: paymentTypeColor.text }}>
                                            {booking.paymentType}
                                        </Badge>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">Source</dt>
                                    <dd className="mt-1"><Badge variant="secondary">{booking.source ?? "Online"}</Badge></dd>
                                </div>
                            </dl>

                            <div className="mt-3 flex items-center justify-between gap-3">
                                <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/admin/booking/${booking.id}`)}
                                >
                                    View details
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon-sm" aria-label={`Booking actions for ${booking.referenceCode ?? booking.guestName}`}>
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {hasRowActions ? (
                                            <DropdownMenuItem onClick={() => setMarkCompletedBookingId(booking.id)}>
                                                <CircleCheck />
                                                Mark as Completed
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
                                        )}
                                        {hasRowActions && (
                                            <DropdownMenuItem onClick={() => setRescheduleBookingId(booking.id)}>
                                                <CalendarSync />
                                                Reschedule
                                            </DropdownMenuItem>
                                        )}
                                        {hasRowActions && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem variant="destructive" onClick={() => setMarkCancelBookingId(booking.id)}>
                                                    <CircleX />
                                                    Mark as Cancelled
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </article>
                    );
                })}
            </div>

            <div className="hidden min-h-0 flex-1 flex-col overflow-x-auto md:flex">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">
                                Booking Reference
                            </TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">
                                Guest
                            </TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">
                                Accommodation
                            </TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">
                                Date
                            </TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">
                                Stay
                            </TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">
                                Payment Type
                            </TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">
                                Source
                            </TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">
                                Status
                            </TableHead>
                            <TableHead className="px-4 py-3 text-right text-xs font-semibold tracking-[0.01em] text-muted-foreground">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.length === 0 && (
                            <AdminTableEmptyState
                                colSpan={9}
                                emptyMessage="No bookings yet."
                                filteredMessage="No bookings found for the current filters."
                                hasActiveFilters={hasActiveFilters}
                                className="px-4 py-8 text-center text-sm text-muted-foreground"
                            />
                        )}

                        {bookings.map((booking) => {
                            const statusDisplay = getBookingStatusDisplay(booking.status);
                            const paymentTypeColor = getPaymentTypeColor(booking.paymentType);
                            const hasRowActions = booking.status === "Confirmed";

                            return (
                                <TableRow key={booking.id} className="group hover:bg-primary/[0.03]">
                                    <TableCell
                                        className={cn(
                                            "border-l-[3px] px-4 py-4 pl-3 transition-colors group-hover:text-foreground",
                                            statusDisplay.accentBorderClassName,
                                        )}
                                    >
                                        <span className="font-medium tracking-tight">{booking.referenceCode ?? "N/A"}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <div className="font-medium leading-none">{booking.guestName}</div>
                                        <div className="mt-1 text-xs text-muted-foreground transition-colors group-hover:text-muted-foreground/80">
                                            {booking.email}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <div className="font-medium">{booking.accommodation.name}</div>
                                        <div className="mt-1 text-xs text-muted-foreground transition-colors group-hover:text-muted-foreground/80">
                                            {booking.accommodation.type}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 align-top">
                                        <div className="font-medium">{format(new Date(booking.bookingDate), "MMM dd, yyyy")}</div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 align-top"><Badge variant="secondary">{booking.source ?? "Online"}</Badge></TableCell>
                                    <TableCell className="px-4 py-4 align-top">
                                        {booking.stayOption?.label ?? booking.stayOptionLabelSnapshot ?? booking.timeSlot ?? "Stay"}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 align-top">
                                        <Badge
                                            style={{
                                                backgroundColor: paymentTypeColor.bg,
                                                color: paymentTypeColor.text,
                                            }}
                                        >
                                            {booking.paymentType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 align-top">
                                        <BookingStatusBadge status={booking.status} />
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="h-auto px-0 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary"
                                                onClick={() => navigate(`/admin/booking/${booking.id}`)}
                                            >
                                                View
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        className="text-muted-foreground transition-colors group-hover:text-foreground"
                                                        aria-label={`Booking actions for ${booking.referenceCode ?? booking.guestName}`}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Action</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />

                                                    {hasRowActions ? (
                                                        <DropdownMenuItem onClick={() => setMarkCompletedBookingId(booking.id)}>
                                                            <CircleCheck />
                                                            Mark as Completed
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
                                                    )}

                                                    {hasRowActions && (
                                                        <DropdownMenuItem onClick={() => setRescheduleBookingId(booking.id)}>
                                                            <CalendarSync />
                                                            Reschedule
                                                        </DropdownMenuItem>
                                                    )}

                                                    {hasRowActions && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem variant="destructive" onClick={() => setMarkCancelBookingId(booking.id)}>
                                                                <CircleX />
                                                                Mark as Cancelled
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

            </div>

            <div className="mt-auto border-t bg-background/80 px-4 py-4">
                <DataPagination
                    meta={meta}
                    fallbackMeta={{
                        total: bookings.length,
                        limit,
                    }}
                    page={page}
                    onPageChange={updatePage}
                    showSinglePageControls
                />
            </div>
        </div>
    );
};

export default BookingTable;
