import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetStaffById, useUpdateStaffRoleMutation } from "@/hooks/admin/staff-management.hook";
import { useStaffManagementStore } from "@/store/admin/staffManagement.store";
import type { MaintenanceExpertise, StaffRole, StaffUser } from "@/types/admin/staff-management.type";
import { useState } from "react";

const ChangeStaffRoleDialog = () => {
    const isChangeRoleOpen = useStaffManagementStore((state) => state.isChangeRoleOpen);
    const changeRoleId = useStaffManagementStore((state) => state.changeRoleId);
    const setIsChangeRoleOpen = useStaffManagementStore((state) => state.setIsChangeRoleOpen);

    const { data, isLoading, error, refetch, isRefetching } = useGetStaffById(changeRoleId);

    return (
        <Dialog open={isChangeRoleOpen} onOpenChange={setIsChangeRoleOpen}>
            <DialogContent className="sm:max-w-xl">
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog
                    onBack={() => setIsChangeRoleOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error && isChangeRoleOpen) && (
                    <NotFoundDialog
                    onBack={() => setIsChangeRoleOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    title="Staff User Not Found"
                    />
                )}

                {data && <ChangeRole key={`${data.id}-${data.role}-${data.expertise ?? "none"}`} staff={data} />}
            </DialogContent>
        </Dialog>
    )
}

const ChangeRole = ({ staff }: { staff: StaffUser }) => {
    const setIsChangeRoleOpen = useStaffManagementStore((state) => state.setIsChangeRoleOpen);
    const { mutateAsync, isPending } = useUpdateStaffRoleMutation(staff.id);

    const [role, setRole] = useState<StaffRole>(staff.role);
    const [expertise, setExpertise] = useState<MaintenanceExpertise | undefined>(staff.expertise ?? undefined);

    const nextExpertise = role === "MAINTENANCE_STAFF" ? expertise : undefined;
    const isUnchanged = role === staff.role && nextExpertise === (staff.expertise ?? undefined);

    return (
        <>
            <DialogHeader>
                <DialogTitle>Change Staff Role</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="text-sm font-semibold mb-3">
                        Staff Member
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
                            <span className="text-muted-foreground">Current Role:</span>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                {staff.role === "KITCHEN_STAFF"
                                    ? "Kitchen Staff"
                                    : staff.role === "RESORT_STAFF"
                                        ? "Resort Staff"
                                        : "Maintenance Staff"}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Expertise:</span>
                            <span className="font-medium">{staff.expertise ?? "—"}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 justify-start lg:grid-cols-2 lg:justify-between">
                    <div className="space-y-2">
                        <Label>Select new role</Label>
                        <Select value={role} onValueChange={(value) => setRole(value as StaffRole)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Staff Role</SelectLabel>
                                    <SelectItem value="KITCHEN_STAFF">Kitchen Staff</SelectItem>
                                    <SelectItem value="RESORT_STAFF">Resort Staff</SelectItem>
                                    <SelectItem value="MAINTENANCE_STAFF">Maintenance Staff</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {role === "MAINTENANCE_STAFF" && (
                        <div className="space-y-2">
                            <Label>
                                Maintenance expertise
                            </Label>
                            <Select
                            value={expertise}
                            onValueChange={(value) => setExpertise(value as MaintenanceExpertise)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select expertise" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Maintenance Expertise</SelectLabel>
                                        <SelectItem value="Electrical">Electrical</SelectItem>
                                        <SelectItem value="Pool">Pool</SelectItem>
                                        <SelectItem value="Construction">Construction</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsChangeRoleOpen(false)}>
                    Cancel
                </Button>
                <Button
                type="button"
                disabled={isPending || isUnchanged || (role === "MAINTENANCE_STAFF" && !expertise)}
                onClick={async () => {
                    await mutateAsync({ role, expertise: nextExpertise });
                    setIsChangeRoleOpen(false);
                }}
                >
                    {isPending ? <LoadingSpinner /> : "Update Role"}
                </Button>
            </div>
        </>
    )
}

export default ChangeStaffRoleDialog
