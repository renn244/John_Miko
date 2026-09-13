import PaymentTable from "@/features/admin/payment-methods/components/PaymentTable";
import AdminPageHeader from "@/features/admin/layout/components/AdminPageHeader";
import UpdatePaymentMethodAvailabilityDialog from "@/features/admin/payment-methods/components/UpdatePaymentMethodAvailabilityDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const PaymentMethods = () => {
  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Payment Methods"
        description="Manage and configure payment channels available during checkout."
        actions={
          <Button asChild>
            <Link to="/admin/payment-methods/add">
              Add Payment Method
              <Plus className="size-4" />
            </Link>
          </Button>
        }
      />

      <PaymentTable />

      <UpdatePaymentMethodAvailabilityDialog />
    </div>
  );
};

export default PaymentMethods;
