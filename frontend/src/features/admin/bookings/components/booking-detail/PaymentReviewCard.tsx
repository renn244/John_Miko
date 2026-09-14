import ViewPhotoDialog from "@/components/common/ViewPhotoDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useBookingAdminStore } from "@/features/admin/bookings/store/bookingAdmin.store";
import { useApprovePaymentMutation } from "@/features/admin/payments/hooks/useAdminPayments";
import type { BookingWithAccommodationAndPreOrderAndPayment } from "@/features/shared/bookings/types/booking.type";
import { formatPeso } from "@/lib/utils";
import { toast } from "sonner";

type PaymentReviewCardProps = {
    booking: BookingWithAccommodationAndPreOrderAndPayment;
};

const getPaymentStatusStyle = (
    status: BookingWithAccommodationAndPreOrderAndPayment["payment"]["status"],
) => {
    switch (status) {
        case "Approved":
            return { bg: "#D1FAE5", text: "#059669", border: "#A7F3D0" };
        case "Rejected":
            return { bg: "#FEE2E2", text: "#DC2626", border: "#FCA5A5" };
        case "Refunded":
            return { bg: "#EDE9FE", text: "#6D28D9", border: "#C4B5FD" };
        default:
            return { bg: "#FEF3C7", text: "#D97706", border: "#FCD34D" };
    }
};

const PaymentReviewCard = ({ booking }: PaymentReviewCardProps) => {
    const payment = booking.payment;
    const setRejectPaymentId = useBookingAdminStore(
        (state) => state.setRejectPaymentId,
    );
    const setRefundPayment = useBookingAdminStore(
        (state) => state.setRefundPayment,
    );
    const { mutateAsync: approvePayment, isPending: isApproving } =
        useApprovePaymentMutation(payment?.id ?? "");

    if (!payment) {
        return (
            <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-base font-semibold text-foreground md:text-lg">
                        Payment Review
                    </h2>
                </div>
                <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-5 text-sm text-muted-foreground">
                    No payment record is available to review for this booking
                    yet.
                </div>
            </Card>
        );
    }

    const style = getPaymentStatusStyle(payment.status);
    const canRecordCancelledBookingRefund =
        payment.status === "Approved" && booking.status === "Cancelled";
    const approve = async () => {
        try {
            await approvePayment();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to approve payment",
            );
        }
    };

    return (
        <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-foreground md:text-lg">
                    Payment Review
                </h2>
                <span
                    className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
                    style={{
                        backgroundColor: style.bg,
                        borderColor: style.border,
                        color: style.text,
                    }}
                >
                    {payment.status}
                </span>
            </div>
            <div className="space-y-4">
                {payment.referenceNumber && (
                    <Detail label="Reference Number">
                        {payment.referenceNumber}
                    </Detail>
                )}

                {payment.method && (
                    <div className="space-y-1 text-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Payment Method
                        </p>
                        <p className="font-medium text-foreground">
                            {payment.method.name}
                        </p>
                        <p className="text-muted-foreground">
                            {payment.method.type || "N/A"}
                            {payment.method.accountNumber
                                ? ` - ${payment.method.accountNumber}`
                                : ""}
                        </p>
                        {payment.method.accountName && (
                            <p className="text-muted-foreground">
                                {payment.method.accountName}
                            </p>
                        )}
                    </div>
                )}

                {payment.proofImageUrl && (
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Proof of Payment
                        </p>
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
                        <p className="mb-1 font-semibold text-destructive">
                            Rejection Note
                        </p>
                        <p>{payment.rejectionNote}</p>
                    </div>
                )}

                {payment.status === "Rejected" && (
                    <div className="space-y-3 rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-950">
                        <div>
                            <p className="font-semibold text-violet-800">
                                Was money received from the guest?
                            </p>
                            <p className="mt-1 text-violet-900/80">
                                If it was received and returned, record the
                                refund and attach its receipt or screenshot. For
                                a troll or invalid payment that was never
                                received, no refund record is needed.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            className="w-full"
                            onClick={() =>
                                setRefundPayment({
                                    id: payment.id,
                                    amountPaid: payment.amountPaid,
                                })
                            }
                        >
                            Record Refund with Proof
                        </Button>
                    </div>
                )}

                {payment.status === "Refunded" && (
                    <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-950">
                        <p className="mb-1 font-semibold text-violet-800">
                            {formatPeso(payment.amountPaid)} refund recorded
                        </p>
                        <p>{payment.refundReason}</p>
                        {payment.refundProofImageUrl && (
                            <div className="mt-3">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-800">
                                    Refund Proof
                                </p>
                                <ViewPhotoDialog
                                    imageUrl={payment.refundProofImageUrl}
                                >
                                    <img
                                        src={payment.refundProofImageUrl}
                                        alt="Refund proof"
                                        className="h-36 w-full rounded-lg border border-violet-200 object-cover"
                                    />
                                </ViewPhotoDialog>
                            </div>
                        )}
                        {payment.refundedAt && (
                            <p className="mt-2 text-xs text-violet-700">
                                Recorded on{" "}
                                {new Date(payment.refundedAt).toLocaleString()}
                                {payment.refundedBy?.name
                                    ? ` by ${payment.refundedBy.name}`
                                    : ""}
                                .
                            </p>
                        )}
                    </div>
                )}

                {payment.verifiedAt && (
                    <p className="text-xs text-muted-foreground">
                        Verified on{" "}
                        {new Date(payment.verifiedAt).toLocaleString()}
                    </p>
                )}

                {payment.status === "Pending" && (
                    <div className="space-y-2 border-t pt-4">
                        <Button
                            className="w-full"
                            disabled={isApproving}
                            onClick={approve}
                        >
                            {isApproving ? (
                                <LoadingSpinner />
                            ) : (
                                "Approve Payment"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => setRejectPaymentId(payment.id)}
                        >
                            Reject Payment
                        </Button>
                    </div>
                )}

                {canRecordCancelledBookingRefund && (
                    <div className="space-y-2 border-t pt-4">
                        <p className="text-sm text-muted-foreground">
                            This cancelled booking has an approved payment.
                            Record the return of{" "}
                            {formatPeso(payment.amountPaid)} to the guest.
                        </p>
                        <Button
                            type="button"
                            variant="destructive"
                            className="w-full"
                            onClick={() =>
                                setRefundPayment({
                                    id: payment.id,
                                    amountPaid: payment.amountPaid,
                                })
                            }
                        >
                            Record Refund with Proof
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

const Detail = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
        </p>
        <div className="mt-1 text-sm font-medium text-foreground">
            {children}
        </div>
    </div>
);

export default PaymentReviewCard;
