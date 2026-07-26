import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import AdminAvailabilityBadge from "@/components/common/AdminAvailabilityBadge";
import AdminDecisionNotice from "@/components/common/AdminDecisionNotice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetStaffById, useReactivateStaffMutation } from "@/hooks/admin/staff-management.hook";
import { useStaffManagementStore } from "@/store/admin/staffManagement.store";
import type { StaffUser } from "@/types/admin/staff-management.type";
import { UserCheck } from "lucide-react";

const ReactivateStaffDialog = () => {
    const isReactivateOpen = useStaffManagementStore((state) => state.isReactivateOpen);
    const reactivateId = useStaffManagementStore((state) => state.reactivateId);
    const setIsReactivateOpen = useStaffManagementStore((state) => state.setIsReactivateOpen);
    const setReactivateId = useStaffManagementStore((state) => state.setReactivateId);

    const { data, isLoading, error, refetch, isRefetching } = useGetStaffById(reactivateId);

    return (
        <Dialog open={isReactivateOpen} onOpenChange={setIsReactivateOpen}>
            <DialogContent className="sm:max-w-xl" onCloseAutoFocus={() => setReactivateId(undefined)}>
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog
                    onBack={() => setIsReactivateOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error && isReactivateOpen) && (
                    <NotFoundDialog
                    onBack={() => setIsReactivateOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    title="Staff User Not Found"
                    />
                )}

                {data && <ReactivateStaff staff={data} />}
            </DialogContent>
        </Dialog>
    )
}

const ReactivateStaff = ({ staff }: { staff: StaffUser }) => {
    const setIsReactivateOpen = useStaffManagementStore((state) => state.setIsReactivateOpen);
    const { mutateAsync, isPending } = useReactivateStaffMutation(staff.id);

    const isActive = staff.status === "ACTIVE";

    return (
        <>
            <DialogHeader>
                <DialogTitle>Reactivate Staff User</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <AdminDecisionNotice
                    tone="success"
                    icon={UserCheck}
                    title="This action will reactivate the staff account."
                    description="The staff user will be able to sign in again once reactivated."
                />

                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="text-sm font-semibold mb-3">
                        Staff details:
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">{staff.name || "Unnamed Staff"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{staff.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Role:</span>
                            <span className="font-medium">
                                {staff.role === "KITCHEN_STAFF"
                                    ? "Kitchen Staff"
                                    : staff.role === "RESORT_STAFF"
                                        ? "Resort Staff"
                                        : "Maintenance Staff"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <AdminAvailabilityBadge active={isActive} />
                        </div>
                    </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                    Are you sure you want to proceed with this action?
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" onClick={() => setIsReactivateOpen(false)} variant="outline">
                    Cancel
                </Button>
                <Button
                type="button"
                variant="success"
                onClick={async () => {
                    await mutateAsync();
                    setIsReactivateOpen(false);
                }}
                disabled={isPending || isActive}
                >
                    {isPending ? <LoadingSpinner /> : (isActive ? "Already Active" : "Reactivate")}
                </Button>
            </div>
        </>
    )
}

export default ReactivateStaffDialog;
