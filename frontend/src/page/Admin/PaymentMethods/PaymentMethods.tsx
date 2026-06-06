import CreatePaymentMethodDialog from "@/components/pageComponents/Admin/PaymentMethods/CreatePaymentMethodDialog";
import DeletePaymentMethodDialog from "@/components/pageComponents/Admin/PaymentMethods/DeletePaymentMethodDialog";
import EditPaymentMethodDialog from "@/components/pageComponents/Admin/PaymentMethods/EditPaymentMethodDialog";
import PaymentTable from "@/components/pageComponents/Admin/PaymentMethods/PaymentTable";
import { Button } from "@/components/ui/button";
import { paymentMethodAdminStore } from "@/store/admin/paymentMethodAdmin.store";
import { Plus } from "lucide-react";

const PaymentMethods = () => {
    const setIsCreateOpen = paymentMethodAdminStore((state) => state.setIsCreateOpen);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Payment Methods</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage manual payment options shown at checkout.
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    Add Method
                    <Plus className="w-5 h-5" />
                </Button>
            </div>

            <PaymentTable />

            <CreatePaymentMethodDialog />

            <EditPaymentMethodDialog />

            <DeletePaymentMethodDialog />
        </div>
    );
};



export default PaymentMethods;
