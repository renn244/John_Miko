import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import AdminEditPageState from "@/components/common/AdminEditPageState";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import PaymentMethodForm from "@/forms/Admin/PaymentMethod/PaymentMethodForm";
import { useGetPaymentMethodByIdQuery, useUpdatePaymentMethodMutation } from "@/hooks/admin/payment-methods.hook";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const EditPaymentMethod = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: paymentMethod, isLoading, error, refetch, isRefetching } = useGetPaymentMethodByIdQuery(id || "");
    const { mutateAsync: updateMethod } = useUpdatePaymentMethodMutation(id || "");

    if (isLoading) {
        return (
            <div className="flex min-h-[320px] items-center justify-center">
                <LoadingSpinner className="size-8" />
            </div>
        );
    }

    if (error) {
        return (
            <AdminEditPageState>
                <ErrorDialog
                onBack={() => navigate("/admin/payment-methods")}
                onRetry={refetch}
                retryLoading={isRefetching}
                />
            </AdminEditPageState>
        );
    }

    if (!paymentMethod) {
        return <AdminEditPageState><NotFoundDialog title="Payment Method Not Found" onBack={() => navigate("/admin/payment-methods")} onRetry={refetch} retryLoading={isRefetching} /></AdminEditPageState>;
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild size="icon" variant="outline" aria-label="Back to payment methods">
                    <Link to="/admin/payment-methods">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold md:text-3xl">Edit Payment Method</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update the payment channel details and guest checkout instructions.
                    </p>
                </div>
            </div>

            <PaymentMethodForm
            isUpdate
            initialData={{
                accountName: paymentMethod.accountName || undefined,
                accountNumber: paymentMethod.accountNumber || undefined,
                instructions: paymentMethod.instructions || undefined,
                isActive: paymentMethod.isActive,
                name: paymentMethod.name,
                qrCodeUrl: paymentMethod.qrCodeUrl || undefined,
                sortOrder: paymentMethod.sortOrder,
                type: paymentMethod.type,
            }}
            onsubmit={async (data) => {
                await updateMethod(data);
                navigate("/admin/payment-methods");
            }}
            oncancel={() => navigate("/admin/payment-methods")}
            />
        </div>
    );
};

export default EditPaymentMethod;
