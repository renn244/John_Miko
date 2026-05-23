import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetBookingById } from "@/hooks/admin/booking.hook";
import getCheckInOut from "@/lib/getCheckInOut";
import type { BookingWithAccommodationAndPreOrderAndPayment } from "@/types/booking.types";
import { ArrowLeft, Calendar, CheckCircle, CreditCard, FileText, MapPin, Pizza, PlusCircle, Users } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";

const getPaymentTypeColor = (paymentType: "Full" | "Partial") => {
    switch (paymentType) {
        case 'Full':
            return { bg: '#D1FAE5', text: '#059669'};
        case 'Partial':
            return { bg: '#FEF3C7', text: '#D97706' };
    }
}

const ViewBooking = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error, refetch, isRefetching } = useGetBookingById(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner className="size-10" />
            </div>
        );
    }

    if (error) {
        return <ErrorDialog onBack={() => navigate(-1)} onRetry={refetch} retryLoading={isRefetching} />;
    }

    if (!data) {
        return (
            <NotFoundDialog
            onBack={() => navigate(-1)}
            onRetry={refetch}
            retryLoading={isRefetching}
            title="Booking Not Found"
            />
        );
    }

    return <BookingViewContent booking={data} />;
};

const BookingViewContent = ({ booking }: { booking: BookingWithAccommodationAndPreOrderAndPayment }) => {
    const { checkIn, checkInDayOfTheWeek, checkOut, checkOutDayOfTheWeek } = getCheckInOut(
        booking.bookingDate,
        booking.timeSlot
    );

    const addOnSubTotal = useMemo(() => {
        const addOns = booking.addOns || [];
        return addOns.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [booking]);

    const addOnAmountForDisplay = booking.payment?.addOnAmount ?? addOnSubTotal;

    const accommodationName = booking.bookedAccommodation?.name ?? booking.accommodation?.name;
    const accommodationType = booking.bookedAccommodation?.type ?? booking.accommodation?.type;
    const accommodationImage = booking.bookedAccommodation?.imageUrl ?? booking.accommodation?.imageUrl;

    const payment = booking.payment;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/booking">
                    <Button size="icon" variant="outline">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>

                <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h1 className="text-2xl md:text-3xl font-bold">Booking Details</h1>
                        <div className="flex items-center gap-2">
                            <Badge>{booking.status}</Badge>
                            <Badge variant="outline">{booking.paymentType} Payment</Badge>
                        </div>
                    </div>
                    <p className="text-sm mt-1 text-muted-foreground break-all">{booking.id}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 items-start gap-6">
                <div className="flex flex-col lg:col-span-2 gap-6">
                    <Card className="p-5 border-2 gap-0">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold">Guest Information</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Full Name</p>
                                <p className="text-lg font-bold">{booking.guestName}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Phone Number</p>
                                <p className="font-semibold">{booking.contactNo}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Email Address</p>
                                <p className="font-semibold break-all text-primary">{booking.email}</p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Guests (Total)</p>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-bold">
                                        {booking.numberOfGuests} {booking.numberOfGuests === 1 ? "Guest" : "Guests"}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Guest Breakdown</p>
                                <p className="font-semibold text-sm text-muted-foreground">
                                    Adult: {booking.adultGuests ?? "—"} · Senior: {booking.seniorGuest ?? "—"} · Kid: {booking.kidGuests ?? "—"}
                                </p>
                            </div>
                        </div>

                        {booking.specialRequests && (
                            <div className="mt-6 border-t pt-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-bold">Special Requests / Notes</h3>
                                </div>
                                <div className="p-4 rounded-lg bg-muted">
                                    <p className="leading-relaxed font-medium">{booking.specialRequests}</p>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="p-5 border-2 gap-0">
                        <div className="flex items-center gap-2 mb-4">
                            <PlusCircle className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold">Add-on Services</h2>
                        </div>

                        <div className="space-y-3">
                            {(booking.addOns || []).length === 0 ? (
                                <p className="text-sm text-muted-foreground">No add-on services selected.</p>
                            ) : (
                                booking.addOns!.map((addOn) => (
                                    <div key={addOn.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                        <div className="space-y-0.5">
                                            <p className="font-semibold">{addOn.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                ₱{addOn.price.toLocaleString()} × {addOn.quantity}
                                            </p>
                                        </div>
                                        <p className="font-bold text-primary">₱{(addOn.price * addOn.quantity).toLocaleString()}</p>
                                    </div>
                                ))
                            )}

                            <div className="pt-3 mt-3 border-t flex justify-between">
                                <span className="font-bold">Add-on Subtotal</span>
                                <span className="font-bold">₱{addOnAmountForDisplay.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 border-2 gap-0">
                        <div className="flex items-center gap-2 mb-4">
                            <Pizza className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold">Pre-order Items</h2>
                        </div>

                        <div className="space-y-3">
                            {(booking.preOrders || []).length === 0 ? (
                                <p className="text-sm text-muted-foreground">No pre-order items.</p>
                            ) : (
                                booking.preOrders!.map((pre) => (
                                    <div key={pre.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                        <div className="space-y-0.5">
                                            <p className="font-medium">{pre.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                ₱{pre.price.toLocaleString()} × {pre.quantity}
                                            </p>
                                        </div>
                                        <p className="font-bold">₱{(pre.price * pre.quantity).toLocaleString()}</p>
                                    </div>
                                ))
                            )}

                            {payment && (
                                <div className="pt-3 mt-3 border-t flex justify-between">
                                    <span className="font-bold">Pre-order Subtotal</span>
                                    <span className="font-bold">₱{payment.preOrderAmount.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col gap-6">
                    <Card className="p-5 border-2 gap-0">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold">Reservation</h2>
                        </div>

                        <div className="space-y-3">
                            <div className="p-4 rounded-lg border-2 bg-muted/50">
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Check-in</p>
                                <p className="font-bold text-lg mb-1">{checkIn}</p>
                                <p className="text-sm text-muted-foreground">{checkInDayOfTheWeek}</p>
                            </div>
                            <div className="p-4 rounded-lg border-2 bg-muted/50">
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Check-out</p>
                                <p className="font-bold text-lg mb-1">{checkOut}</p>
                                <p className="text-sm text-muted-foreground">{checkOutDayOfTheWeek}</p>
                            </div>

                            <div className="pt-4 mt-4 border-t">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <h3 className="font-bold">Accommodation</h3>
                                </div>

                                <div className="flex gap-3">
                                    {accommodationImage ? (
                                        <img
                                            src={accommodationImage}
                                            alt={accommodationName || "Accommodation"}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-muted" />
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold truncate">{accommodationName}</p>
                                        <p className="text-sm text-muted-foreground truncate">{accommodationType}</p>
                                        {booking.bookedAccommodation?.price !== undefined && (
                                            <p className="text-sm font-semibold mt-1">
                                                Snapshot Price:{" "}
                                                <span className="text-primary">₱{booking.bookedAccommodation.price.toLocaleString()}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 border-2 gap-0">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold">Payment</h2>
                            </div>
                            
                            <Badge 
                            style={{
                                backgroundColor: getPaymentTypeColor(booking.paymentType).bg,
                                color: getPaymentTypeColor(booking.paymentType).text
                            }}
                            >
                                {booking.paymentType}
                            </Badge>
                        </div>

                        {payment ? (
                            <div className="space-y-3">

                                <div className="rounded-lg space-y-1 border-2 p-4 bg-muted/30">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Accommodation</span>
                                        <span className="font-semibold">₱{payment.accommodationAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Guest Fees</span>
                                        <span className="font-semibold">₱{payment.guestFeeAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Pre-order</span>
                                        <span className="font-semibold">₱{payment.preOrderAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Add-ons</span>
                                        <span className="font-semibold">₱{addOnAmountForDisplay.toLocaleString()}</span>
                                    </div>

                                    <div className="pt-3 mt-3 border-t flex justify-between">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-primary">₱{payment.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="rounded-lg border-2 p-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Amount Paid</span>
                                        <span className="font-bold text-primary">
                                            ₱{payment.amountPaid.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-muted-foreground">Balance Due</span>
                                        <span className="font-bold">
                                            ₱{payment.amountToPaid.toLocaleString()}
                                        </span>
                                    </div>

                                    {booking.paymentType === "Full" && payment.amountToPaid === 0 && (
                                        <div className="mt-3 flex items-center justify-center gap-2 p-2 rounded-lg bg-primary/10 text-primary">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="font-bold text-sm">
                                                Fully Paid
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No payment record available.</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ViewBooking;
