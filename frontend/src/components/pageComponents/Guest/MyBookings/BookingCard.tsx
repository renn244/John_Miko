import BookingReportDocumentationsSection from "@/components/common/BookingReportDocumentationsSection";
import { Button } from "@/components/ui/button";
import { useGetBookingById } from "@/hooks/admin/booking.hook";
import getCheckInOut from "@/lib/getCheckInOut";
import { cn, formatPeso } from "@/lib/utils";
import type { BookingWithAccommodationAndFeedback, BookingWithAccommodationAndPreOrder } from "@/types/booking.types";
import { Calendar, CheckCircle, ChevronDown, ChevronUp, Clock, CreditCard, Users, XCircle } from "lucide-react";
import { useMemo, useState, type ComponentProps } from "react";
import { Link } from "react-router";

type BookingCardProps = {
    variant?: "default" | "compact";
    booking: BookingWithAccommodationAndFeedback & Partial<BookingWithAccommodationAndPreOrder>;
    className?: string;
} & ComponentProps<"div">;

const BookingCard = ({ booking, className,  variant="default", style, ...props }: BookingCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isCompact = variant === "compact";
    const {
        data: detailedBooking,
        isLoading: isDetailLoading,
    } = useGetBookingById(!isCompact && isExpanded ? booking.id : null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return { bg: '#FEF3C7', text: '#D97706', accent: '#F59E0B', icon: Clock };
            case 'Confirmed':
                return { bg: '#DBEAFE', text: '#1E73BE', accent: '#0B5CFF', icon: CheckCircle };
            case 'Completed':
                return { bg: '#D1FAE5', text: '#059669', accent: '#10B981', icon: CheckCircle };
            case 'Cancelled':
                return { bg: '#FEE2E2', text: '#DC2626', accent: '#EF4444', icon: XCircle };
            default:
                return { bg: '#F3F4F6', text: '#6B7280', accent: '#94A3B8', icon: Clock };
        }
    };  
 
    const statusColor = getStatusColor(booking.status);
    const StatusIcon = statusColor.icon;
    const paymentStatusStyle = (() => {
        switch (detailedBooking?.payment?.status) {
            case "Approved":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Rejected":
                return "bg-red-100 text-red-700 border-red-200";
            case "Pending":
                return "bg-amber-100 text-amber-700 border-amber-200";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    })();

    const { checkIn, checkOut } = getCheckInOut({
        bookingDate: booking.bookingDate,
        startTime: booking.stayOption?.startTime,
        endTime: booking.stayOption?.endTime,
        label: booking.stayOption?.label ?? booking.stayOptionLabelSnapshot,
    });

    const preOrderItems = detailedBooking?.preOrders ?? booking.preOrders ?? [];
    const addOnItems = detailedBooking?.addOns ?? booking.addOns ?? [];
    const reports = detailedBooking?.reports ?? booking.reports;
    const payment = detailedBooking?.payment;

    const preOrderTotal = useMemo(() => {
        return preOrderItems.reduce((total, item) => total + item.quantity, 0);
    }, [preOrderItems]);

    const addOnTotal = useMemo(() => {
        return addOnItems.reduce((total, item) => total + item.quantity, 0);
    }, [addOnItems]);

    return (
        <div
            className={cn(
                "overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
                isCompact ? "border-0 bg-white shadow-none" : "border-l-4",
                className
            )}
            style={{
                ...style,
                borderLeftColor: isCompact ? style?.borderLeftColor : statusColor.accent,
            }}
            {...props}
        >
            <div className={cn(
                "flex gap-4",
                isCompact ? "items-start" : "flex-col p-4 sm:flex-row md:p-5"
            )}>

                <div className={cn(
                    "overflow-hidden shrink-0 bg-gray-200",
                    isCompact ? "h-20 w-28 rounded-md sm:h-24 sm:w-36" : "h-36 w-full rounded-lg sm:h-32 sm:w-48"
                )}>
                    <img
                    src={booking.accommodation.imageUrl}
                    alt={booking.accommodation.name}
                    className="w-full h-full object-cover"
                    />
                </div>

                {/* Booking Info */}
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                    <div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <h3 className={cn(
                                "font-bold leading-tight",
                                isCompact ? "text-lg" : "text-xl"
                            )}>
                                {booking.accommodation.name}
                            </h3>
                            <div className="flex shrink-0 flex-wrap gap-2">
                                <div
                                className={cn(
                                    "flex items-center gap-2 rounded-full",
                                    isCompact ? "px-2.5 py-1" : "px-3 py-1.5"
                                )}
                                style={{ backgroundColor: statusColor.bg }}
                                >
                                    <StatusIcon className={cn(isCompact ? "size-3.5" : "size-4")} style={{ color: statusColor.text }} />
                                    <span className={cn("font-semibold", isCompact ? "text-xs" : "text-sm")} style={{ color: statusColor.text }}>
                                        {booking.status}
                                    </span>
                                </div>

                                {!isCompact && (
                                    <div className="rounded-full border bg-muted/40 px-3 py-1.5 text-sm font-semibold text-muted-foreground">
                                        {booking.paymentType} Payment
                                    </div>
                                )}

                                {variant === "default"  && (
                                    <Link to={booking.feedback ? `/feedback/edit/${booking.feedback.id}` : `/feedback/${booking.id}`}>
                                        <Button variant={booking.feedback ? "outline" : "default"} size="sm">
                                        {booking.feedback ? "Edit Feedback" : "Submit Feedback"}
                                        </Button>
                                    </Link>
                                )}
                            </div>
                            
                        </div>
                        <p className={cn(
                            "text-muted-foreground",
                            isCompact ? "text-xs" : "mb-4 text-sm"
                        )}>
                            Booking ID: {booking.id}
                        </p>
                    </div>

                    <div className={cn(
                        "grid gap-3",
                        isCompact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    )}>
                        <div className={cn("flex items-start gap-2", isCompact && "hidden")}>
                            <Calendar className={cn("shrink-0 mt-0.5 text-muted-foreground", isCompact ? "size-4" : "size-5")} />
                            <div>
                                <p className="text-xs mb-0.5 text-muted-foreground">
                                    Check-in
                                </p>
                                <p className="text-sm font-semibold">
                                    {checkIn}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <CreditCard className={cn("shrink-0 mt-0.5 text-muted-foreground", isCompact ? "size-4" : "size-5")} />
                            <div>
                                <p className="text-xs mb-0.5 text-muted-foreground">
                                    Payment Type
                                </p>
                                <p className="text-sm font-semibold">
                                    {booking.paymentType}
                                </p>
                            </div>
                        </div>
                        <div className={cn("flex items-start gap-2", isCompact && "hidden")}>
                            <Calendar className={cn("shrink-0 mt-0.5 text-muted-foreground", isCompact ? "size-4" : "size-5")} />
                            <div>
                                <p className="text-xs mb-0.5 text-muted-foreground">
                                    Check-out
                                </p>
                                <p className="text-sm font-semibold">
                                    {checkOut}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Users className={cn("shrink-0 mt-0.5 text-muted-foreground", isCompact ? "size-4" : "size-5")} />
                            <div>
                                <p className="text-xs mb-0.5 text-muted-foreground">
                                    Guest Count
                                </p>
                                <p className="text-sm font-semibold">
                                    {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'person' : 'people'}
                                </p>
                            </div>
                        </div>
                        {/* <div className="flex items-start gap-2">
                            <CreditCard className="w-5 h-5 shrink-0 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-xs mb-0.5 text-muted-foreground">
                                Total Amount
                                </p>
                                <p className="text-sm font-semibold">
                                    ₱{booking.totalAmount}
                                </p>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {isCompact ? (
                <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Check-in
                        </p>
                        <p className="mt-1 text-sm font-semibold">{checkIn}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Check-out
                        </p>
                        <p className="mt-1 text-sm font-semibold">{checkOut}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Accommodation
                        </p>
                        <p className="mt-1 text-sm font-semibold">{booking.accommodation.type}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Stay Type
                        </p>
                        <p className="mt-1 text-sm font-semibold">{booking.stayOption?.label ?? booking.stayOptionLabelSnapshot}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Pre-orders
                        </p>
                        <p className="mt-1 text-sm font-semibold">{preOrderTotal} item{preOrderTotal === 1 ? "" : "s"}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Add-ons
                        </p>
                        <p className="mt-1 text-sm font-semibold">{addOnTotal} item{addOnTotal === 1 ? "" : "s"}</p>
                    </div>
                </div>
            ) : (
            <div className="border-t px-4 py-3 md:px-5">
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full justify-center gap-2 rounded-xl bg-muted/60 hover:bg-muted"
                    onClick={() => setIsExpanded((prev) => !prev)}
                >
                    {isExpanded ? "Hide Details" : "View Details"}
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </Button>
            </div>
            )}

            {!isCompact && isExpanded && (
                <div className="grid gap-5 border-t px-4 py-5 md:px-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="space-y-5">
                        <div className="grid gap-4 rounded-lg bg-muted/30 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                    Accommodation Type
                                </p>
                                <p className="font-semibold">{booking.accommodation.type}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                    Guest Breakdown
                                </p>
                                <p className="font-semibold">
                                    {booking.adultGuests ?? 0} adult{(booking.adultGuests ?? 0) === 1 ? "" : "s"}, {booking.seniorGuest ?? 0} senior{(booking.seniorGuest ?? 0) === 1 ? "" : "s"}, {booking.kidGuests ?? 0} child{(booking.kidGuests ?? 0) === 1 ? "" : "ren"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                    Stay Type
                                </p>
                                <p className="font-semibold">{booking.stayOption?.label ?? booking.stayOptionLabelSnapshot}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                    Inclusions
                                </p>
                                <p className="font-semibold">
                                    {preOrderTotal} pre-order{preOrderTotal === 1 ? "" : "s"} • {addOnTotal} add-on{addOnTotal === 1 ? "" : "s"}
                                </p>
                            </div>
                        </div>

                        {booking.specialRequests && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">
                                    Special Requests
                                </p>
                                <div className="rounded-lg border bg-muted/40 p-4">
                                    <p className="font-medium">{booking.specialRequests}</p>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">
                                    Pre-Ordered Items
                                </p>
                                <div className="space-y-2">
                                    {preOrderItems.length > 0 ? preOrderItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3">
                                            <div className="min-w-0">
                                                <span className="font-medium">{item.name}</span>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatPeso(item.price)} each • x{item.quantity}
                                                </p>
                                            </div>
                                            <span className="shrink-0 text-sm font-semibold">
                                                {formatPeso(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    )) : (
                                        <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                                            No pre-ordered items.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">
                                    Add-ons
                                </p>
                                <div className="space-y-2">
                                    {addOnItems.length > 0 ? addOnItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3">
                                            <div className="min-w-0">
                                                <span className="font-medium">{item.name}</span>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatPeso(item.price)} each • x{item.quantity}
                                                </p>
                                            </div>
                                            <span className="shrink-0 text-sm font-semibold">
                                                {formatPeso(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    )) : (
                                        <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                                            No add-on services.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {(reports || []).length > 0 && (
                            <BookingReportDocumentationsSection reports={reports} compact />
                        )}
                    </div>

                    <aside className="rounded-lg border bg-muted/40 p-4 lg:self-start">
                        <h4 className="text-lg font-bold">Payment Summary</h4>
                        {isDetailLoading ? (
                            <div className="mt-3 space-y-2 border-t pt-3">
                                <div className="h-4 rounded bg-muted" />
                                <div className="h-4 rounded bg-muted" />
                                <div className="h-4 rounded bg-muted" />
                            </div>
                        ) : payment ? (
                            <>
                                <div className="mt-3 space-y-2 border-t pt-3 text-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Accommodation</span>
                                        <span className="font-semibold">{formatPeso(payment.accommodationAmount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Guest Fees</span>
                                        <span className="font-semibold">{formatPeso(payment.guestFeeAmount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Pre-orders</span>
                                        <span className="font-semibold">{formatPeso(payment.preOrderAmount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Add-ons</span>
                                        <span className="font-semibold">{formatPeso(payment.addOnAmount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 border-t pt-3">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-primary">{formatPeso(payment.totalAmount)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2 rounded-lg border bg-background p-3 text-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Paid Now</span>
                                        <span className="font-bold text-primary">{formatPeso(payment.amountPaid)}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Payment Due</span>
                                        <span className="font-bold">{formatPeso(payment.amountToPaid)}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Payment Status</span>
                                        <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", paymentStatusStyle)}>
                                            {payment.status}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="mt-3 rounded-md border bg-background p-3 text-xs leading-5 text-muted-foreground">
                                Payment details are not available for this booking yet.
                            </p>
                        )}
                    </aside>
                </div>
            )}
        </div>
    )
}

export default BookingCard;
