import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Accommodation } from "@/types/admin/accommodation.type";
import type { BookingWithPaymentInfo } from "@/types/booking.types";
import { Calendar, CheckCircle, CreditCard, Mail, Phone } from "lucide-react";

export type BookingConfirmationSummary = {
    guestName: string;
    email: string;
    contactNo: string;
    stayType: 'OverNight' | 'DayStay';
    checkIn: Date;
    checkOut: Date;
    paymentType: 'Full' | 'Partial';
    total: number;
    amountPaid: number;
    amountToPayLater: number;
};

type BookingConfirmationProps = {
    accommodation: Accommodation;
    summary: BookingConfirmationSummary;
    booking: BookingWithPaymentInfo;

    backToHome: () => void;
    viewMyBookings: () => void;
};

const BookingConfirmation = ({ accommodation, summary, booking, backToHome, viewMyBookings }: BookingConfirmationProps) => {
    return (
        <div className="space-y-6 py-6">
            <div className="rounded-2xl border bg-card p-6">
                <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Payment Submitted</h2>
                        <p className="text-sm text-muted-foreground">
                            Your booking is pending verification. We will confirm once the payment is reviewed.
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-xl border bg-muted/30 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reference Number</p>
                    <p className="text-2xl font-semibold tracking-tight">{booking.referenceNumber}</p>
                </div>
            </div>

            <Card className="p-5 border-2">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">Booking Summary</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Guest</p>
                        <p className="font-semibold">{summary.guestName}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stay Type</p>
                        <p className="font-semibold">{summary.stayType === 'OverNight' ? 'Over Night' : 'Day Stay'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Check-in</p>
                        <p className="font-semibold">{summary.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Check-out</p>
                        <p className="font-semibold">{summary.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Accommodation</p>
                        <p className="font-semibold">{accommodation.name}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment Type</p>
                        <p className="font-semibold">{summary.paymentType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{summary.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{summary.contactNo}</span>
                    </div>
                </div>
            </Card>

            <Card className="p-5 border-2">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">Payment Summary</h3>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total booking value</span>
                        <span className="font-semibold">₱{summary.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid now</span>
                        <span className="font-semibold text-primary">₱{summary.amountPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Balance due at check-in</span>
                        <span className="font-semibold">₱{summary.amountToPayLater.toLocaleString()}</span>
                    </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                    Keep your reference number handy. Our staff will verify your payment before confirming the booking.
                </p>
            </Card>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button variant="outline" onClick={() => backToHome()}>
                    Back to Home
                </Button>
                <Button onClick={() => viewMyBookings() }>
                    View My Bookings
                </Button>
            </div>
        </div>
    )
}

export default BookingConfirmation;
