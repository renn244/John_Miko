import AddOnServiceFilter from "@/features/admin/add-on-services/components/AddOnServiceFilter";
import AdminPageHeader from "@/features/admin/layout/components/AdminPageHeader";
import AddOnServiceList from "@/features/admin/add-on-services/components/AddOnServiceList";
import AddOnServiceStatistics from "@/features/admin/add-on-services/components/AddOnServiceStatistics";
import DeleteAddOnServiceDialog from "@/features/admin/add-on-services/components/DeleteAddOnServiceDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const AddOnService = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add-on Services"
        description="Manage optional guest services, pricing, and availability."
        actions={
          <Button asChild>
            <Link to="/admin/add-on-service/add">
              Add Service
              <Plus className="size-4" />
            </Link>
          </Button>
        }
      />

      <AddOnServiceStatistics />

      <AddOnServiceFilter />

      <AddOnServiceList />

      <DeleteAddOnServiceDialog />
    </div>
  );
};

export default AddOnService;
