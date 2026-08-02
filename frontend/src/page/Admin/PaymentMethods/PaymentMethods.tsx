import PaymentTable from "@/components/pageComponents/Admin/PaymentMethods/PaymentTable";
import AdminPageHeader from "@/components/pageComponents/Admin/AdminPageHeader";
import UpdatePaymentMethodAvailabilityDialog from "@/components/pageComponents/Admin/PaymentMethods/UpdatePaymentMethodAvailabilityDialog";
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
