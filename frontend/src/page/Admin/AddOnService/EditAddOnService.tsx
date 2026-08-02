import { Button } from "@/components/ui/button";
import AdminEditPageState from "@/components/common/AdminEditPageState";
import AdminEditPageLoading from "@/components/common/AdminEditPageLoading";
import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import AddOnServiceForm from "@/forms/Admin/AddOnService/AddOnServiceForm";
import { useGetAddOnServiceById, useUpdateAddOnServiceMutation } from "@/hooks/admin/add-on-service.hook";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const EditAddOnService = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: service, isLoading, error, refetch, isRefetching } = useGetAddOnServiceById(id);
    const { mutateAsync: updateService } = useUpdateAddOnServiceMutation(id || "");

    if (isLoading) return <AdminEditPageLoading />;
    
    if (error) {
        return <AdminEditPageState><ErrorDialog onBack={() => navigate("/admin/add-on-service")} onRetry={refetch} retryLoading={isRefetching} /></AdminEditPageState>;
    }

    if (!service) {
        return <AdminEditPageState><NotFoundDialog title="Add-on Service Not Found" onBack={() => navigate("/admin/add-on-service")} onRetry={refetch} retryLoading={isRefetching} /></AdminEditPageState>;
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild size="icon" variant="outline" aria-label="Back to add-on services">
                    <Link to="/admin/add-on-service">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Edit Service</h1>
                    <p className="text-sm text-muted-foreground mt-1">Update the details below to modify the add-on service</p>
                </div>
            </div>

            <AddOnServiceForm
            isUpdate
            initialData={{
                imageUrl: service.imageUrl,
                name: service.name,
                description: service.description || "",
                price: service.price,
                quantity: service.quantity,
            }}
            onsubmit={updateService}
            oncancel={() => navigate("/admin/add-on-service")}
            />
        </div>
    );
};

export default EditAddOnService;
