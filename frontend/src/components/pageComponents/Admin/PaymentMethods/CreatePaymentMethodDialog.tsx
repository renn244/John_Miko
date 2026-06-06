import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PaymentMethodForm from "@/forms/Admin/PaymentMethod/PaymentMethodForm";
import { useCreatePaymentMethodMutation } from "@/hooks/admin/payment-methods.hook";
import { paymentMethodAdminStore } from "@/store/admin/paymentMethodAdmin.store";

const CreatePaymentMethodDialog = () => {
    const isCreateOpen = paymentMethodAdminStore((state) => state.isCreateOpen);
    const setIsCreateOpen = paymentMethodAdminStore((state) => state.setIsCreateOpen);

    const { mutateAsync: createMethod } = useCreatePaymentMethodMutation();

    return (
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new payment method
                    </DialogDescription>
                </DialogHeader>

                <PaymentMethodForm 
                onsubmit={async (data) => {
                    await createMethod(data);
                    setIsCreateOpen(false);
                }}
                oncancel={() => setIsCreateOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CreatePaymentMethodDialog