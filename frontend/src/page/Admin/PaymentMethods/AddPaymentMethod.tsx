import { Button } from "@/components/ui/button";
import PaymentMethodForm from "@/forms/Admin/PaymentMethod/PaymentMethodForm";
import { useCreatePaymentMethodMutation } from "@/hooks/admin/payment-methods.hook";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

const AddPaymentMethod = () => {
    const navigate = useNavigate();
    const { mutateAsync: createMethod } = useCreatePaymentMethodMutation();

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild size="icon" variant="outline">
                    <Link to="/admin/payment-methods">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold md:text-3xl">Add Payment Method</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Configure the payment channel details shown to guests during checkout.
                    </p>
                </div>
            </div>

            <PaymentMethodForm
            onsubmit={async (data) => {
                await createMethod(data);
                navigate("/admin/payment-methods");
            }}
            oncancel={() => navigate("/admin/payment-methods")}
            />
        </div>
    );
};

export default AddPaymentMethod;
