import { Button } from "@/components/ui/button";
import AdminEditPageState from "@/components/common/AdminEditPageState";
import AdminEditPageLoading from "@/components/common/AdminEditPageLoading";
import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import MaintenanceForm from "@/features/admin/maintenance/forms/MaintenanceForm";
import { useGetMaintenancebyId, useUpdateMaintenanceMutation } from "@/features/admin/maintenance/hooks/useAdminMaintenance";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const EditMaintenance = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: maintenance, isLoading, error, refetch, isRefetching } = useGetMaintenancebyId(id);
    const { mutateAsync: updateMaintenance } = useUpdateMaintenanceMutation(id || "");

    if (isLoading) return <AdminEditPageLoading />;

    if (error) {
        return <AdminEditPageState><ErrorDialog onBack={() => navigate("/admin/maintenance")} onRetry={refetch} retryLoading={isRefetching} /></AdminEditPageState>;
    }

    if (!maintenance) {
        return <AdminEditPageState><NotFoundDialog title="Maintenance Record Not Found" onBack={() => navigate("/admin/maintenance")} onRetry={refetch} retryLoading={isRefetching} /></AdminEditPageState>;
    }

    return (
        <div className="mx-auto max-w-7xl space-y-5">
            <div className="flex items-center gap-4">
                <Button asChild size="icon" variant="outline" aria-label="Back to maintenance">
                    <Link to="/admin/maintenance">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold md:text-3xl">
                        Edit Maintenance
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update the details below to modify the maintenance record
                    </p>
                </div>
            </div>

            <MaintenanceForm 
            isUpdate
            initialData={maintenance}
            onsubmit={async (data) => {
                updateMaintenance(data)
            }}
            oncancel={() => navigate('/admin/maintenance')}
            />
        </div>
    )
}

export default EditMaintenance
