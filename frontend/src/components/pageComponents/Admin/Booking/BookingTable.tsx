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
import { useGetBookingsAdminQuery } from "@/hooks/admin/booking.hook";
import { useBookingSearch } from "@/hooks/admin/booking.search";
import { useBookingAdminStore } from "@/store/admin/bookingAdmin.store";
import { format } from "date-fns";
import { CalendarSync, CircleCheck, CircleX, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";

const getStatusColor = (status: string) => {
    switch (status) {
        case "Pending":
            return { bg: "#FEF3C7", text: "#B45309", border: "#F59E0B" };
        case "Confirmed":
            return { bg: "#DBEAFE", text: "#1E73BE", border: "#1E73BE" };
        case "Completed":
            return { bg: "#D1FAE5", text: "#059669", border: "#059669" };
        case "Cancelled":
            return { bg: "#FEE2E2", text: "#DC2626", border: "#DC2626" };
        default:
            return { bg: "#F3F4F6", text: "#6B7280", border: "#6B7280" };
    }
};

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
        status: status as any,
        paymentType: paymentType as any,
    });

    if (isLoading) return;

    const bookings = data?.data ?? [];
    const meta = data?.meta;
    const hasActiveFilters = Boolean(search || status || paymentType || accommodationId || bookingDate);

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col overflow-x-auto">
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
                                colSpan={8}
                                emptyMessage="No bookings yet."
                                filteredMessage="No bookings found for the current filters."
                                hasActiveFilters={hasActiveFilters}
                                className="px-4 py-8 text-center text-sm text-muted-foreground"
                            />
                        )}

                        {bookings.map((booking) => {
                            const statusColor = getStatusColor(booking.status);
                            const paymentTypeColor = getPaymentTypeColor(booking.paymentType);
                            const hasRowActions = booking.status === "Confirmed";

                            return (
                                <TableRow key={booking.id} className="group hover:bg-primary/[0.03]">
                                    <TableCell
                                        className="border-l-[3px] px-4 py-4 pl-3 transition-colors group-hover:text-foreground"
                                        style={{ borderLeftColor: statusColor.border }}
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
                                        <Badge
                                            style={{
                                                backgroundColor: statusColor.bg,
                                                color: statusColor.text,
                                                borderColor: statusColor.border,
                                                borderWidth: "1px",
                                            }}
                                        >
                                            {booking.status}
                                        </Badge>
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
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-foreground"
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
                                                        <DropdownMenuItem onClick={() => setMarkCancelBookingId(booking.id)}>
                                                            <CircleX />
                                                            Mark as Cancelled
                                                        </DropdownMenuItem>
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
        </div>
    );
};

export default BookingTable;
