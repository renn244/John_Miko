import AddOnServiceFilter from "@/components/pageComponents/Admin/AddOnService/AddOnServiceFilter";
import AdminPageHeader from "@/components/pageComponents/Admin/AdminPageHeader";
import AddOnServiceList from "@/components/pageComponents/Admin/AddOnService/AddOnServiceList";
import AddOnServiceStatistics from "@/components/pageComponents/Admin/AddOnService/AddOnServiceStatistics";
import DeleteAddOnServiceDialog from "@/components/pageComponents/Admin/AddOnService/DeleteAddOnServiceDialog";
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
