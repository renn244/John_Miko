import { Button } from "@/components/ui/button";
import StaffForm from "@/features/admin/staff-management/forms/StaffForm";
import { useCreateStaffMutation } from "@/features/admin/staff-management/hooks/useStaffManagement";
import { staffManagementApi } from "@/features/admin/staff-management/api/adminStaffManagement.api";
import RestoreDeletedStaffDialog from "@/features/admin/staff-management/components/RestoreDeletedStaffDialog";
import { useStaffManagementStore } from "@/features/admin/staff-management/store/staffManagementAdmin.store";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const RESTORE_REQUIRED_MESSAGE = "A deleted staff account already uses this email. Restore it to continue.";

const AddStaff = () => {
    const navigate = useNavigate();
    const { mutateAsync: createStaff } = useCreateStaffMutation();
    const setRestoreRequest = useStaffManagementStore((state) => state.setRestoreRequest);

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild size="icon" variant="outline" aria-label="Back to staff management">
                    <Link to="/admin/staff-management">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </Button>
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
                try {
                    await createStaff(data);
                } catch (error) {
                    if (
                        error instanceof Error
                        && error.message === RESTORE_REQUIRED_MESSAGE
                    ) {
                        const candidate = await staffManagementApi.getRestoreCandidate(data.email);
                        toast.info(error.message);
                        setRestoreRequest({ staffId: candidate.id, data });
                        return;
                    }

                    throw error;
                }
            }}
            oncancel={() => navigate('/admin/staff-management')}
            />

            <RestoreDeletedStaffDialog />
        </div>
    )
}

export default AddStaff;
