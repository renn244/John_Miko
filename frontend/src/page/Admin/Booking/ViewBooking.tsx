import BookingReportDocumentationsSection from "@/components/common/BookingReportDocumentationsSection";
import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import ViewPhotoDialog from "@/components/common/ViewPhotoDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Textarea } from "@/components/ui/textarea";
import { useGetBookingById } from "@/hooks/admin/booking.hook";
import { useApprovePaymentMutation, useRejectPaymentMutation } from "@/hooks/admin/payment.hook";
import getCheckInOut from "@/lib/getCheckInOut";
import { formatPeso } from "@/lib/utils";
import type { BookingWithAccommodationAndPreOrderAndPayment } from "@/types/booking.types";
import {
    ArrowLeft,
    BedDouble,
    Calendar,
    CheckCircle,
    Clock3,
    CreditCard,
    FileText,
    Mail,
    Phone,
    Pizza,
    PlusCircle,
    Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const getPaymentTypeColor = (paymentType: "Full" | "Partial") => {
    switch (paymentType) {
        case "Full":
            return { bg: "#D1FAE5", text: "#059669", border: "#A7F3D0" };
        case "Partial":
            return { bg: "#FEF3C7", text: "#D97706", border: "#FCD34D" };
    }
};

const getPaymentStatusColor = (status?: "Pending" | "Approved" | "Rejected") => {
    switch (status) {
        case "Approved":
            return { bg: "#D1FAE5", text: "#059669", border: "#A7F3D0" };
        case "Rejected":
            return { bg: "#FEE2E2", text: "#DC2626", border: "#FCA5A5" };
        default:
            return { bg: "#FEF3C7", text: "#D97706", border: "#FCD34D" };
    }
};

const getBookingStatusColor = (status: BookingWithAccommodationAndPreOrderAndPayment["status"]) => {
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

const ViewBooking = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error, refetch, isRefetching } = useGetBookingById(id);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
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
    const { checkIn, checkOut } = getCheckInOut({
        bookingDate: booking.bookingDate,
        startTime: booking.stayOption?.startTime,
        endTime: booking.stayOption?.endTime,
        label: booking.stayOption?.label ?? booking.stayOptionLabelSnapshot,
    });

    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectionNote, setRejectionNote] = useState("");

    const addOns = booking.addOns ?? [];
    const preOrders = booking.preOrders ?? [];
    const stayLabel = booking.stayOption?.label ?? booking.stayOptionLabelSnapshot ?? booking.timeSlot ?? "Stay";

    const addOnSubTotal = useMemo(() => {
        return addOns.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [addOns]);

    const preOrderSubTotal = useMemo(() => {
        return preOrders.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [preOrders]);

    const addOnAmountForDisplay = booking.payment?.addOnAmount ?? addOnSubTotal;
    const preOrderAmountForDisplay = booking.payment?.preOrderAmount ?? preOrderSubTotal;

    const accommodationName = booking.bookedAccommodation?.name ?? booking.accommodation?.name ?? "Accommodation";
    const accommodationType = booking.bookedAccommodation?.type ?? booking.accommodation?.type ?? "Type unavailable";
    const accommodationImage = booking.bookedAccommodation?.imageUrl ?? booking.accommodation?.imageUrl;

    const payment = booking.payment;
    const paymentId = payment?.id || "";
    const paymentStatusStyle = getPaymentStatusColor(payment?.status);
    const bookingStatusStyle = getBookingStatusColor(booking.status);
    const paymentTypeStyle = getPaymentTypeColor(booking.paymentType);

    const guestBreakdown = `${booking.adultGuests ?? 0} adult${(booking.adultGuests ?? 0) === 1 ? "" : "s"}, ${booking.seniorGuest ?? 0} senior${(booking.seniorGuest ?? 0) === 1 ? "" : "s"}, ${booking.kidGuests ?? 0} child${(booking.kidGuests ?? 0) === 1 ? "" : "ren"}`;
    const bookingInfoMetrics = [
        { label: "Check-in", value: checkIn, Icon: Calendar },
        { label: "Check-out", value: checkOut, Icon: Clock3 },
        {
            label: "Guest Count",
            value: `${booking.numberOfGuests} ${booking.numberOfGuests === 1 ? "person" : "people"}`,
            Icon: Users,
        },
    ];
    const paymentSummaryItems = payment
        ? [
            { label: "Accommodation", value: formatPeso(payment.accommodationAmount) },
            { label: "Guest Fee", value: formatPeso(payment.guestFeeAmount) },
            { label: "Add-ons", value: formatPeso(addOnAmountForDisplay) },
            { label: "Pre-orders", value: formatPeso(payment.preOrderAmount) },
        ]
        : [];

    const { mutateAsync: approvePayment, isPending: isApproving } = useApprovePaymentMutation(paymentId);
    const { mutateAsync: rejectPayment, isPending: isRejecting } = useRejectPaymentMutation(paymentId);

    return (
        <div className="mx-auto max-w-7xl space-y-5">
            <div className="space-y-3">
                <Link
                    to="/admin/booking"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to Bookings
                </Link>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Booking Details</h1>
                        <p className="mt-1 break-all text-sm text-muted-foreground">{booking.referenceCode ?? "N/A"}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            className="border"
                            style={{
                                backgroundColor: bookingStatusStyle.bg,
                                borderColor: bookingStatusStyle.border,
                                color: bookingStatusStyle.text,
                            }}
                        >
                            {booking.status}
                        </Badge>
                        <Badge
                            className="border"
                            style={{
                                backgroundColor: paymentTypeStyle.bg,
                                borderColor: paymentTypeStyle.border,
                                color: paymentTypeStyle.text,
                            }}
                        >
                            {booking.paymentType} Payment
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="space-y-5">
                    <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <BedDouble className="size-5 text-primary" />
                            <h2 className="text-base font-semibold text-foreground md:text-lg">Booking Information</h2>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            {accommodationImage ? (
                                <img
                                    src={accommodationImage}
                                    alt={accommodationName}
                                    className="h-36 w-full rounded-xl border object-cover sm:h-32 sm:w-48"
                                />
                            ) : (
                                <div className="h-36 w-full rounded-xl border bg-muted sm:h-32 sm:w-48" />
                            )}

                            <div className="min-w-0 flex-1">
                                <div className="min-w-0">
                                    <h2 className="truncate text-xl font-semibold tracking-tight">{accommodationName}</h2>
                                    <p className="mt-1 break-all text-sm text-muted-foreground">
                                        Booking Reference: {booking.referenceCode ?? "N/A"}
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs font-medium">
                                            {accommodationType}
                                        </Badge>
                                        <Badge
                                            className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary"
                                        >
                                            {stayLabel}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mt-4 border-t pt-4">
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        {bookingInfoMetrics.map(({ label, value, Icon }) => (
                                            <div key={label} className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Icon className="size-3.5 text-muted-foreground/80" />
                                                    <p className="text-xs font-medium text-muted-foreground">{label}</p>
                                                </div>
                                                <div className="pl-5 text-sm font-medium text-foreground">{value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Users className="size-5 text-primary" />
                            <h2 className="text-base font-semibold text-foreground md:text-lg">Guest Information</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Primary Guest</p>
                                <div className="mt-1 text-sm font-medium text-foreground">{booking.guestName}</div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact Email</p>
                                <div className="mt-1 text-sm font-medium text-foreground">
                                    <a
                                        href={`mailto:${booking.email}`}
                                        className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                                    >
                                        <Mail className="size-4 text-muted-foreground" />
                                        <span className="break-all">{booking.email}</span>
                                    </a>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone Number</p>
                                <div className="mt-1 text-sm font-medium text-foreground">
                                    <a
                                        href={`tel:${booking.contactNo}`}
                                        className="inline-flex items-center gap-2 font-medium text-foreground hover:text-primary"
                                    >
                                        <Phone className="size-4 text-muted-foreground" />
                                        {booking.contactNo}
                                    </a>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Guests</p>
                                <div className="mt-1 text-sm font-medium text-foreground">
                                    {booking.numberOfGuests} {booking.numberOfGuests === 1 ? "guest" : "guests"}
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Guest Breakdown</p>
                                <div className="mt-1 text-sm font-medium text-foreground">{guestBreakdown}</div>
                            </div>
                        </div>

                        {booking.specialRequests && (
                            <div className="mt-5 border-t pt-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Special Requests
                                </p>
                                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                                    <div className="flex items-start gap-3">
                                        <FileText className="mt-0.5 size-4 shrink-0 text-amber-700" />
                                        <p className="leading-6">{booking.specialRequests}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    <div className="grid gap-5 xl:grid-cols-2">
                        <Card className="h-full gap-0 rounded-xl border bg-card p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <PlusCircle className="size-5 text-primary" />
                                <h2 className="text-base font-semibold text-foreground md:text-lg">Add-on Services</h2>
                            </div>
                            <div className="flex flex-1 flex-col">
                                {addOns.length === 0 ? (
                                    <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-5 text-sm text-muted-foreground">
                                        No add-on services selected.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {addOns.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <PlusCircle className="size-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {formatPeso(item.price)} x {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="shrink-0 text-sm font-semibold text-foreground">
                                                    {formatPeso(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-auto flex items-center justify-between border-t pt-4">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Add-on subtotal</span>
                                    <span className="text-sm font-semibold text-foreground">{formatPeso(addOnAmountForDisplay)}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="h-full gap-0 rounded-xl border bg-card p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <Pizza className="size-5 text-primary" />
                                <h2 className="text-base font-semibold text-foreground md:text-lg">Pre-orders</h2>
                            </div>
                            <div className="flex flex-1 flex-col">
                                {preOrders.length === 0 ? (
                                    <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-5 text-sm text-muted-foreground">
                                        No pre-order items.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {preOrders.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <Pizza className="size-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {formatPeso(item.price)} x {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="shrink-0 text-sm font-semibold text-foreground">
                                                    {formatPeso(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-auto flex items-center justify-between border-t pt-4">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pre-order subtotal</span>
                                    <span className="text-sm font-semibold text-foreground">{formatPeso(preOrderAmountForDisplay)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
                        <BookingReportDocumentationsSection reports={booking.reports} compact />
                    </Card>
                </div>

                <div className="space-y-5 xl:sticky xl:top-6">
                    <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <CreditCard className="size-5 text-primary" />
                            <h2 className="text-base font-semibold text-foreground md:text-lg">Payment Summary</h2>
                        </div>
                        {payment ? (
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    {paymentSummaryItems.map((item) => (
                                        <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                                            <span className="text-muted-foreground">{item.label}</span>
                                            <span className="font-medium text-foreground">{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="font-semibold text-foreground">Total</span>
                                        <span className="font-semibold text-foreground">{formatPeso(payment.totalAmount)}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-muted-foreground">Amount Paid</span>
                                        <span className="text-emerald-700">{formatPeso(payment.amountPaid)}</span>
                                    </div>
                                    <div className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-semibold text-primary">Balance Due</span>
                                            <span className="text-xl font-bold text-primary">{formatPeso(payment.amountToPaid)}</span>
                                        </div>
                                    </div>

                                    {booking.paymentType === "Full" && payment.amountToPaid === 0 && (
                                        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                                            <CheckCircle className="size-4" />
                                            Fully paid
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-5 text-sm text-muted-foreground">
                                Payment summary will appear here once a payment record is available for this booking.
                            </div>
                        )}
                    </Card>

                    <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <FileText className="size-5 text-primary" />
                                <h2 className="text-base font-semibold text-foreground md:text-lg">Payment Review</h2>
                            </div>
                            {payment ? (
                                <Badge
                                    className="border"
                                    style={{
                                        backgroundColor: paymentStatusStyle.bg,
                                        borderColor: paymentStatusStyle.border,
                                        color: paymentStatusStyle.text,
                                    }}
                                >
                                    {payment.status}
                                </Badge>
                            ) : null}
                        </div>
                        {payment ? (
                            <div className="space-y-4">
                                {payment.referenceNumber && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reference Number</p>
                                        <div className="mt-1 text-sm font-medium text-foreground">{payment.referenceNumber}</div>
                                    </div>
                                )}

                                {payment.method && (
                                    <div className="space-y-1 text-sm">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment Method</p>
                                        <p className="font-medium text-foreground">{payment.method.name}</p>
                                        <p className="text-muted-foreground">
                                            {payment.method.type || "N/A"}
                                            {payment.method.accountNumber ? ` - ${payment.method.accountNumber}` : ""}
                                        </p>
                                        {payment.method.accountName && (
                                            <p className="text-muted-foreground">{payment.method.accountName}</p>
                                        )}
                                    </div>
                                )}

                                {payment.proofImageUrl && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Proof of Payment</p>
                                        <ViewPhotoDialog imageUrl={payment.proofImageUrl}>
                                            <img
                                                src={payment.proofImageUrl}
                                                alt="Payment proof"
                                                className="h-44 w-full rounded-lg border object-cover"
                                            />
                                        </ViewPhotoDialog>
                                    </div>
                                )}

                                {payment.rejectionNote && (
                                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
                                        <p className="mb-1 font-semibold text-destructive">Rejection Note</p>
                                        <p>{payment.rejectionNote}</p>
                                    </div>
                                )}

                                {payment.verifiedAt && (
                                    <p className="text-xs text-muted-foreground">
                                        Verified on {new Date(payment.verifiedAt).toLocaleString()}
                                    </p>
                                )}

                                {payment.status === "Pending" && (
                                    <div className="space-y-2 border-t pt-4">
                                        <Button
                                            className="w-full"
                                            disabled={isApproving}
                                            onClick={async () => {
                                                if (!paymentId) return;
                                                await approvePayment();
                                            }}
                                        >
                                            {isApproving ? <LoadingSpinner /> : "Approve Payment"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setIsRejectOpen(true)}
                                        >
                                            Reject Payment
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-5 text-sm text-muted-foreground">
                                No payment record is available to review for this booking yet.
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Reject Payment</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Provide a reason for rejection. This will be shown to the guest.
                        </p>
                        <Textarea
                            rows={4}
                            value={rejectionNote}
                            onChange={(event) => setRejectionNote(event.target.value)}
                            placeholder="Explain why the payment proof was rejected..."
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => setIsRejectOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={!rejectionNote || isRejecting}
                            onClick={async () => {
                                if (!paymentId) return;
                                await rejectPayment(rejectionNote);
                                setIsRejectOpen(false);
                                setRejectionNote("");
                            }}
                        >
                            {isRejecting ? <LoadingSpinner /> : "Reject Payment"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ViewBooking;
