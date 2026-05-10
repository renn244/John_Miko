import ChangeStaffRoleDialog from "@/components/pageComponents/Admin/StaffManagement/ChangeStaffRoleDialog";
import DeactivateStaffDialog from "@/components/pageComponents/Admin/StaffManagement/DeactivateStaffDialog";
import ReactivateStaffDialog from "@/components/pageComponents/Admin/StaffManagement/ReactivateStaffDialog";
import StaffFilter from "@/components/pageComponents/Admin/StaffManagement/StaffFilter";
import StaffStatistics from "@/components/pageComponents/Admin/StaffManagement/StaffStatistics";
import StaffTable from "@/components/pageComponents/Admin/StaffManagement/StaffTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const StaffManagement = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Staff Management
                    </h1>
                    <p className="text-sm mt-1 text-muted-foreground">
                        Manage staff accounts, roles, and active status
                    </p>
                </div>
                <Link to="/admin/staff-management/add">
                    <Button>
                        Add Staff
                        <Plus className="w-5 h-5 text-white" />
                    </Button>
                </Link>
            </div>

            <StaffStatistics />
            <StaffFilter />
            <StaffTable />

            <ChangeStaffRoleDialog />
            <DeactivateStaffDialog />
            <ReactivateStaffDialog />
        </div>
    )
}

export default StaffManagement
