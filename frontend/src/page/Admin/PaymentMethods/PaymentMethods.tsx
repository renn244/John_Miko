import PaymentTable from "@/components/pageComponents/Admin/PaymentMethods/PaymentTable";
import UpdatePaymentMethodAvailabilityDialog from "@/components/pageComponents/Admin/PaymentMethods/UpdatePaymentMethodAvailabilityDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const PaymentMethods = () => {
    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Payment Methods</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage and configure payment channels available during checkout.
                    </p>
                </div>
                <Link to="/admin/payment-methods/add">
                    <Button className="gap-2">
                        Add Payment Method
                        <Plus className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <PaymentTable />

            <UpdatePaymentMethodAvailabilityDialog />
        </div>
    );
};



export default PaymentMethods;
