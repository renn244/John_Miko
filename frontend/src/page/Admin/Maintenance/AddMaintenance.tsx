import { Button } from "@/components/ui/button"
import MaintenanceForm from "@/forms/Admin/Maintenance/MaintenanceForm"
import { useCreateMaintenanceMutation } from "@/hooks/admin/maintenance.hook"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router"

const AddMaintenance = () => {
  const navigate = useNavigate();
  const { mutateAsync: createMaintenance } = useCreateMaintenanceMutation();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex items-center gap-4">
        <Link to="/admin/maintenance">
          <Button size="icon" variant="outline">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">
            Add New Maintenance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details below to create a new maintenance record
          </p>
        </div>
      </div>

      <MaintenanceForm 
      onsubmit={async (data) => {
        await createMaintenance(data)
      }}
      oncancel={() => navigate('/admin/maintenance')}
      />
    </div>
  )
}

export default AddMaintenance
