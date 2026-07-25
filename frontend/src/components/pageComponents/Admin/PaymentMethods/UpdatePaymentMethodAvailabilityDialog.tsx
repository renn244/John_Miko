import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetPaymentMethodByIdQuery, useUpdatePaymentMethodAvailabilityMutation } from "@/hooks/admin/payment-methods.hook";
import { cn } from "@/lib/utils";
import { paymentMethodAdminStore } from "@/store/admin/paymentMethodAdmin.store";
import type { PaymentMethod } from "@/types/payment-method.type";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const paymentTypeLabel: Record<PaymentMethod["type"], string> = {
    BANK: "Bank Transfer",
    CASH: "Cash",
    GCASH: "GCash",
    MAYA: "Maya",
};

const UpdatePaymentMethodAvailabilityDialog = () => {
    const isOpen = paymentMethodAdminStore((state) => state.isAvailabilityConfirmationOpen);
    const setIsOpen = paymentMethodAdminStore((state) => state.setIsAvailabilityConfirmationOpen);
    const methodId = paymentMethodAdminStore((state) => state.availabilityConfirmationId);
    const setMethodId = paymentMethodAdminStore((state) => state.setAvailabilityConfirmationId);

    const { data, error, refetch, isLoading, isRefetching } = useGetPaymentMethodByIdQuery(methodId || "");

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-xl" onCloseAutoFocus={() => setMethodId(null)}>
                {isLoading && (
                    <div className="flex h-64 items-center justify-center">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}

                {error && (
                    <ErrorDialog
                    onBack={() => setIsOpen(false)}
                    onRetry={refetch}
                    retryLoading={isRefetching}
                    />
                )}

                {!data && !isLoading && !error && isOpen && (
                    <NotFoundDialog
                    onBack={() => setIsOpen(false)}
                    onRetry={refetch}
                    retryLoading={isRefetching}
                    title="Payment Method Not Found"
                    />
                )}

                {data && <UpdatePaymentMethodAvailability method={data} />}
            </DialogContent>
        </Dialog>
    );
};

const UpdatePaymentMethodAvailability = ({ method }: { method: PaymentMethod }) => {
    const setIsOpen = paymentMethodAdminStore((state) => state.setIsAvailabilityConfirmationOpen);
    const isDeactivating = method.isActive;
    const nextStatus = !method.isActive;
    const { mutateAsync, isPending } = useUpdatePaymentMethodAvailabilityMutation(method.id);

    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    {isDeactivating ? "Deactivate Payment Method" : "Activate Payment Method"}
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <div
                className={cn(
                    "flex items-start gap-4 rounded-lg border-2 p-4",
                    isDeactivating ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50",
                )}
                >
                    <AlertTriangle
                    className={cn(
                        "mt-0.5 h-6 w-6 shrink-0",
                        isDeactivating ? "text-amber-600" : "text-emerald-600",
                    )}
                    />
                    <div>
                        <h3 className={cn(
                            "mb-1 text-sm font-bold",
                            isDeactivating ? "text-amber-800" : "text-emerald-800",
                        )}>
                            {isDeactivating ? "Warning: This affects guest checkout" : "Confirm payment method activation"}
                        </h3>
                        <p className={cn(
                            "text-sm",
                            isDeactivating ? "text-amber-900" : "text-emerald-900",
                        )}>
                            {isDeactivating
                                ? "Guests will no longer see this payment method during checkout. Existing payments that already used this method will remain unchanged."
                                : "Guests will be able to choose this payment method during checkout immediately."}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border bg-gray-50 p-4">
                    <h4 className="mb-3 text-sm font-semibold">
                        Payment Method Details:
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="min-w-0 truncate font-semibold">
                                {method.name}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Type:</span>
                            <Badge className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary shadow-none">
                                {paymentTypeLabel[method.type]}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t pt-2">
                            <span className="text-muted-foreground">Current Status:</span>
                            <StatusBadge active={method.isActive} label={method.isActive ? "Active" : "Inactive"} />
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">New Status:</span>
                            <StatusBadge active={nextStatus} label={nextStatus ? "Active" : "Inactive"} />
                        </div>
                    </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                    Do you want to proceed with this change?
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                >
                    Cancel
                </Button>
                <Button
                type="button"
                disabled={isPending}
                onClick={async () => {
                    await mutateAsync(nextStatus);
                    setIsOpen(false);
                }}
                className={cn(
                    isDeactivating
                        ? "bg-amber-700 hover:bg-amber-700/90"
                        : "bg-emerald-700 hover:bg-emerald-700/90"
                )}
                >
                    {isPending ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {isDeactivating ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            {isDeactivating ? "Deactivate" : "Activate"}
                        </>
                    )}
                </Button>
            </div>
        </>
    );
};

const StatusBadge = ({ active, label }: { active: boolean; label: string }) => {
    return (
        <Badge className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-medium shadow-none",
            active
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-100 text-slate-600",
        )}>
            {label}
        </Badge>
    );
};

export default UpdatePaymentMethodAvailabilityDialog;
