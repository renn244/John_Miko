import BookingReportDocumentationsSection from "@/components/common/BookingReportDocumentationsSection";
import { Button } from "@/components/ui/button";
import getCheckInOut from "@/lib/getCheckInOut";
import { cn } from "@/lib/utils";
import type { BookingWithAccommodationAndFeedback, BookingWithAccommodationAndPreOrder } from "@/types/booking.types";
import { Calendar, CheckCircle, ChevronDown, ChevronUp, Clock, CreditCard, Users, XCircle } from "lucide-react";
import { useMemo, useState, type ComponentProps } from "react";
import { Link } from "react-router";

type BookingCardProps = {
    variant?: "default" | "compact";
    booking: BookingWithAccommodationAndFeedback & Partial<BookingWithAccommodationAndPreOrder>;
    className?: string;
} & ComponentProps<"div">;

const BookingCard = ({ booking, className,  variant="default", ...props }: BookingCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return { bg: '#FEF3C7', text: '#D97706', icon: Clock };
            case 'Confirmed':
                return { bg: '#DBEAFE', text: '#1E73BE', icon: CheckCircle };
            case 'Completed':
                return { bg: '#D1FAE5', text: '#059669', icon: CheckCircle };
            case 'Cancelled':
                return { bg: '#FEE2E2', text: '#DC2626', icon: XCircle };
            default:
                return { bg: '#F3F4F6', text: '#6B7280', icon: Clock };
        }
    };  
 
    const statusColor = getStatusColor(booking.status);
    const StatusIcon = statusColor.icon;

    const { checkIn, checkOut } = getCheckInOut({
        bookingDate: booking.bookingDate,
        startTime: booking.stayOption?.startTime,
        endTime: booking.stayOption?.endTime,
        label: booking.stayOption?.label ?? booking.stayOptionLabelSnapshot,
    });

    const preOrderTotal = useMemo(() => {
        return (booking.preOrders || []).reduce((total, item) => total + item.quantity, 0);
    }, [booking.preOrders]);

    return (
        <div className={cn("bg-white rounded-xl border-2 overflow-hidden p-4", className)} {...props}>
            <div className="flex gap-4">

                <div className="w-48 h-32 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                    <img
                    src={booking.accommodation.imageUrl}
                    alt={booking.accommodation.name}
                    className="w-full h-full object-cover"
                    />
                </div>

                {/* Booking Info */}
                <div className="flex-1 flex flex-col gap-2">
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-xl font-bold">
                                {booking.accommodation.name}
                            </h3>
                            <div className="flex gap-2">
                                <div
                                className="px-3 py-1.5 rounded-sm flex items-center gap-2"
                                style={{ backgroundColor: statusColor.bg }}
                                >
                                    <StatusIcon className="w-4 h-4" style={{ color: statusColor.text }} />
                                    <span className="font-semibold text-sm" style={{ color: statusColor.text }}>
                                        {booking.status}
                                    </span>
                                </div>

                                {variant === "default"  && (
                                    <Link to={booking.feedback ? `/feedback/edit/${booking.feedback.id}` : `/feedback/${booking.id}`}>
                                        <Button>
                                        {booking.feedback ? "Edit Feedback" : "Submit Feedback"}
                                        </Button>
                                    </Link>
                                )}
                            </div>
                            
                        </div>
                        <p className="text-sm mb-4 text-muted-foreground">
                            Booking ID: {booking.id}
                        </p>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex items-start gap-2">
                            <Calendar className="w-5 h-5 shrink-0 mt-0.5 text-muted-foreground" />
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
                            <CreditCard className="w-5 h-5 shrink-0 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-xs mb-0.5 text-muted-foreground">
                                    Payment Type
                                </p>
                                <p className="text-sm font-semibold">
                                    {booking.paymentType}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Calendar className="w-5 h-5 shrink-0 mt-0.5 text-muted-foreground" />
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
                            <Users className="w-5 h-5 shrink-0 mt-0.5 text-muted-foreground" />
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

            <div className="mt-4">
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full justify-center gap-2 rounded-xl"
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

            {isExpanded && (
                <div className="mt-6 space-y-6 border-t pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                Accommodation Type
                            </p>
                            <p className="font-semibold">{booking.accommodation.type}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                Stay Type
                            </p>
                            <p className="font-semibold">{booking.stayOption?.label ?? booking.stayOptionLabelSnapshot}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                Payment Type
                            </p>
                            <p className="font-semibold">{booking.paymentType}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                Pre-Ordered Items
                            </p>
                            <p className="font-semibold">{preOrderTotal} item{preOrderTotal === 1 ? "" : "s"}</p>
                        </div>
                    </div>

                    {booking.specialRequests && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">
                                Special Requests
                            </p>
                            <div className="rounded-xl bg-muted/40 p-4">
                                <p className="font-medium">{booking.specialRequests}</p>
                            </div>
                        </div>
                    )}

                    {(booking.preOrders || []).length > 0 && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">
                                Pre-Ordered Items
                            </p>
                            <div className="space-y-2">
                                {booking.preOrders?.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-sm font-semibold text-muted-foreground">
                                            x{item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <BookingReportDocumentationsSection reports={booking.reports} />
                </div>
            )}
        </div>
    )
}

export default BookingCard;
