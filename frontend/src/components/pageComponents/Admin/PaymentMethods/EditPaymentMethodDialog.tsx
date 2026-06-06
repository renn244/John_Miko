import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import PaymentMethodForm from "@/forms/Admin/PaymentMethod/PaymentMethodForm";
import { useGetPaymentMethodByIdQuery, useUpdatePaymentMethodMutation } from "@/hooks/admin/payment-methods.hook";
import { paymentMethodAdminStore } from "@/store/admin/paymentMethodAdmin.store";
import type { PaymentMethod } from "@/types/payment-method.type";

const EditPaymentMethodDialog = () => {
    const editId = paymentMethodAdminStore((state) => state.editId);
    const isEditOpen = paymentMethodAdminStore((state) => state.isEditOpen);
    const setIsEditOpen = paymentMethodAdminStore((state) => state.setIsEditOpen);

    const { data, error, refetch, isLoading, isRefetching } = useGetPaymentMethodByIdQuery(editId || '');

    return (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog 
                    onBack={() => setIsEditOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error) && (
                    <NotFoundDialog 
                    onBack={() => setIsEditOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {data && <EditPaymentMethod method={data} />}
            </DialogContent>
        </Dialog>
    )
}

const EditPaymentMethod = ({ method } : { method: PaymentMethod } ) => {
    const setIsEditOpen = paymentMethodAdminStore((state) => state.setIsEditOpen);

    const { mutateAsync: updateMethod } = useUpdatePaymentMethodMutation(method.id);

    return (
        <>
            <DialogHeader>
                <DialogTitle>Edit Payment Method</DialogTitle>
                <DialogDescription>
                    Edit details for payment 
                </DialogDescription>
            </DialogHeader>

            <PaymentMethodForm      
            isUpdate
            initialData={{
                name: method.name,
                type: method.type,
                accountName: method.accountName || undefined,
                accountNumber: method.accountNumber || undefined,
                instructions: method.instructions || undefined,
                qrCodeUrl: method.qrCodeUrl || undefined,
                sortOrder: method.sortOrder,
                isActive: method.isActive,
            }}
            onsubmit={async (data) => {
                await updateMethod(data);
                setIsEditOpen(false);
            }}
            oncancel={() => setIsEditOpen(false)}
            />
        </>        
    )
}

export default EditPaymentMethodDialog