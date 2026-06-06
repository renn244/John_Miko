import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useDeletePaymentMethodMutation, useGetPaymentMethodByIdQuery } from "@/hooks/admin/payment-methods.hook";
import { paymentMethodAdminStore } from "@/store/admin/paymentMethodAdmin.store";
import type { PaymentMethod } from "@/types/payment-method.type";

const DeletePaymentMethodDialog = () => {
    const isDeleteOpen = paymentMethodAdminStore((state) => state.isDeleteOpen);
    const setIsDeleteOpen = paymentMethodAdminStore((state) => state.setIsDeleteOpen);
    const deleteId = paymentMethodAdminStore((state) => state.deleteId);

    const { data, error, refetch, isLoading, isRefetching } = useGetPaymentMethodByIdQuery(deleteId || "");

    return (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="sm:max-w-md">
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog 
                    onBack={() => setIsDeleteOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error) && (
                    <NotFoundDialog 
                    onBack={() => setIsDeleteOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {data && <DeletePaymentMethod method={data} />}
            </DialogContent>
        </Dialog>
    )
}

const DeletePaymentMethod = ({ method } : { method: PaymentMethod }) => {
    const setIsDeleteOpen = paymentMethodAdminStore((state) => state.setIsDeleteOpen);

    const { mutateAsync: deleteMethod, isPending } = useDeletePaymentMethodMutation(method.id);

    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Delete Payment Method
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete <span className="font-semibold">{method?.name}</span>?
                </p>
            </div>
            <div className="flex items-center justify-end gap-2">
                <Button 
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                >
                    Cancel
                </Button>
                <Button
                variant="destructive"
                disabled={isPending}
                onClick={async () => {
                    if (!method) return;
                    await deleteMethod();

                    setIsDeleteOpen(false);
                }}
                >
                    {isPending ? <LoadingSpinner /> : "Delete"}
                </Button>
            </div>
        </>
    )
}

export default DeletePaymentMethodDialog