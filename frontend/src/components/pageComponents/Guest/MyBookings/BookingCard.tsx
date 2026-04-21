import { Button } from "@/components/ui/button";
import getCheckInOut from "@/lib/getCheckInOut";
import { cn } from "@/lib/utils";
import type { BookingWithAccommodationAndFeedback } from "@/types/booking.types";
import { Calendar, CheckCircle, Clock, Users, XCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { Link } from "react-router";

type BookingCardProps = {
    variant?: "default" | "compact";
    booking: BookingWithAccommodationAndFeedback;
    className?: string;
} & ComponentProps<"div">;

const BookingCard = ({ booking, className,  variant="default", ...props }: BookingCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
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

    const { checkIn, checkOut } = getCheckInOut(booking.bookingDate, booking.timeSlot);

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
        </div>
    )
}

export default BookingCard;