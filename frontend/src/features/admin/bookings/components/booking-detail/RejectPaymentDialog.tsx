import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import RejectPaymentForm from "@/features/admin/bookings/forms/payment-review/RejectPaymentForm";
import { useBookingAdminStore } from "@/features/admin/bookings/store/bookingAdmin.store";

const RejectPaymentDialog = () => {
    const isRejectPaymentOpen = useBookingAdminStore(
        (state) => state.isRejectPaymentOpen,
    );
    const setIsRejectPaymentOpen = useBookingAdminStore(
        (state) => state.setIsRejectPaymentOpen,
    );
    const rejectPaymentId = useBookingAdminStore(
        (state) => state.rejectPaymentId,
    );
    const setRejectPaymentId = useBookingAdminStore(
        (state) => state.setRejectPaymentId,
    );

    return (
        <Dialog
            open={isRejectPaymentOpen}
            onOpenChange={setIsRejectPaymentOpen}
        >
            <DialogContent
                className="sm:max-w-lg"
                onCloseAutoFocus={() => setRejectPaymentId(undefined)}
            >
                <DialogHeader>
                    <DialogTitle>Reject Payment</DialogTitle>
                </DialogHeader>

                {rejectPaymentId && (
                    <RejectPaymentForm
                        paymentId={rejectPaymentId}
                        onCancel={() => setRejectPaymentId(undefined)}
                        onSuccess={() => setRejectPaymentId(undefined)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default RejectPaymentDialog;
