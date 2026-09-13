import ChangeStaffRoleDialog from "@/features/admin/staff-management/components/ChangeStaffRoleDialog";
import AdminPageHeader from "@/features/admin/layout/components/AdminPageHeader";
import DeactivateStaffDialog from "@/features/admin/staff-management/components/DeactivateStaffDialog";
import ReactivateStaffDialog from "@/features/admin/staff-management/components/ReactivateStaffDialog";
import DeleteStaffDialog from "@/features/admin/staff-management/components/DeleteStaffDialog";
import StaffStatistics from "@/features/admin/staff-management/components/StaffStatistics";
import StaffTable from "@/features/admin/staff-management/components/StaffTable";
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
