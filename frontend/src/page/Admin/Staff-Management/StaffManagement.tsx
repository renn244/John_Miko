import ChangeStaffRoleDialog from "@/components/pageComponents/Admin/StaffManagement/ChangeStaffRoleDialog";
import AdminPageHeader from "@/components/pageComponents/Admin/AdminPageHeader";
import DeactivateStaffDialog from "@/components/pageComponents/Admin/StaffManagement/DeactivateStaffDialog";
import ReactivateStaffDialog from "@/components/pageComponents/Admin/StaffManagement/ReactivateStaffDialog";
import DeleteStaffDialog from "@/components/pageComponents/Admin/StaffManagement/DeleteStaffDialog";
import StaffStatistics from "@/components/pageComponents/Admin/StaffManagement/StaffStatistics";
import StaffTable from "@/components/pageComponents/Admin/StaffManagement/StaffTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const StaffManagement = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <AdminPageHeader
        title="Staff Management"
        description="Manage staff accounts, roles, expertise, and active status."
        actions={
          <Button asChild>
            <Link to="/admin/staff-management/add">
              Add Staff
              <Plus className="size-4" />
            </Link>
          </Button>
        }
      />

      <StaffStatistics />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        <StaffTable />
      </div>

      <ChangeStaffRoleDialog />
      <DeactivateStaffDialog />
      <ReactivateStaffDialog />
      <DeleteStaffDialog />
    </div>
  );
};

export default StaffManagement;
