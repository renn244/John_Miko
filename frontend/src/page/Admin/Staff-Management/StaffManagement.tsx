import ChangeStaffRoleDialog from "@/components/pageComponents/Admin/StaffManagement/ChangeStaffRoleDialog";
import DeactivateStaffDialog from "@/components/pageComponents/Admin/StaffManagement/DeactivateStaffDialog";
import ReactivateStaffDialog from "@/components/pageComponents/Admin/StaffManagement/ReactivateStaffDialog";
import StaffStatistics from "@/components/pageComponents/Admin/StaffManagement/StaffStatistics";
import StaffTable from "@/components/pageComponents/Admin/StaffManagement/StaffTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const StaffManagement = () => {
    return (
        <div className="flex min-h-0 flex-1 flex-col gap-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">
                        Staff Management
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage staff accounts, roles, expertise, and active status.
                    </p>
                </div>
                <Button asChild className="gap-2">
                    <Link to="/admin/staff-management/add">
                        Add Staff
                        <Plus className="h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <StaffStatistics />

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
                <StaffTable />
            </div>

            <ChangeStaffRoleDialog />
            <DeactivateStaffDialog />
            <ReactivateStaffDialog />
        </div>
    )
}

export default StaffManagement
