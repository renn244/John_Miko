import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import RefundPaymentForm from "@/features/admin/bookings/forms/payment-review/RefundPaymentForm";
import { useBookingAdminStore } from "@/features/admin/bookings/store/bookingAdmin.store";

const RefundPaymentDialog = () => {
    const isRefundPaymentOpen = useBookingAdminStore(
        (state) => state.isRefundPaymentOpen,
    );
    const setIsRefundPaymentOpen = useBookingAdminStore(
        (state) => state.setIsRefundPaymentOpen,
    );
    const refundPayment = useBookingAdminStore((state) => state.refundPayment);
    const setRefundPayment = useBookingAdminStore(
        (state) => state.setRefundPayment,
    );

    return (
        <Dialog
            open={isRefundPaymentOpen}
            onOpenChange={setIsRefundPaymentOpen}
        >
            <DialogContent
                className="sm:max-w-lg"
                onCloseAutoFocus={() => setRefundPayment(undefined)}
            >
                <DialogHeader>
                    <DialogTitle>Record Refund</DialogTitle>
                </DialogHeader>

                {refundPayment && (
                    <RefundPaymentForm
                        paymentId={refundPayment.id}
                        amountPaid={refundPayment.amountPaid}
                        onCancel={() => setRefundPayment(undefined)}
                        onSuccess={() => setRefundPayment(undefined)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default RefundPaymentDialog;
