import { Button } from "@/components/ui/button";
import StaffForm from "@/forms/Admin/StaffManagement/StaffForm";
import { useCreateStaffMutation } from "@/hooks/admin/staff-management.hook";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

const AddStaff = () => {
    const navigate = useNavigate();
    const { mutateAsync: createStaff } = useCreateStaffMutation();

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/staff-management">
                    <Button size="icon" variant="outline">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Add Staff
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create a new staff account and assign the appropriate operational role.
                    </p>
                </div>
            </div>

            <StaffForm
            onsubmit={async (data) => {
                await createStaff(data);
                
                return 
            }}
            oncancel={() => navigate('/admin/staff-management')}
            />
        </div>
    )
}

export default AddStaff;
