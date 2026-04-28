import { Button } from "@/components/ui/button";
import MaintenanceForm from "@/forms/Admin/Maintenance/MaintenanceForm";
import { useGetMaintenancebyId, useUpdateMaintenanceMutation } from "@/hooks/admin/maintenance.hook";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const EditMaintenance = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: maintenance, isLoading, error } = useGetMaintenancebyId(id);
    const { mutateAsync: updateMaintenance } = useUpdateMaintenanceMutation(id || "");

    if(isLoading) return null;

    if(!maintenance) return null;

    if(error) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/maintenance">
                    <Button size="icon" variant="outline">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Edit Maintenance
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1A">
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