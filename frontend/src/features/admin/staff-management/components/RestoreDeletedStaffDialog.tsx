import AdminDecisionNotice from "@/components/common/AdminDecisionNotice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useRestoreStaffMutation } from "@/features/admin/staff-management/hooks/useStaffManagement";
import { useStaffManagementStore } from "@/features/admin/staff-management/store/staffManagementAdmin.store";
import type { CreateStaffDto } from "@/features/admin/staff-management/types/staff-management.type";
import { RotateCcw } from "lucide-react";

const getRoleLabel = (role: CreateStaffDto["role"]) =>
  role === "KITCHEN_STAFF"
    ? "Kitchen Staff"
    : role === "RESORT_STAFF"
      ? "Resort Staff"
      : "Maintenance Staff";

const RestoreDeletedStaffDialog = () => {
  const restore = useRestoreStaffMutation();
  const request = useStaffManagementStore((state) => state.restoreRequest);
  const setRestoreRequest = useStaffManagementStore((state) => state.setRestoreRequest);
  const open = request !== undefined;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && setRestoreRequest(undefined)}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Restore Deleted Staff Account?</DialogTitle>
          <DialogDescription>
            This email belongs to a deleted staff account. Restoring it keeps the account history while applying the details you just entered.
          </DialogDescription>
        </DialogHeader>

        {request ? (
          <div className="space-y-4">
            <AdminDecisionNotice
              tone="warning"
              icon={RotateCcw}
              title="A new temporary password will be generated."
              description="The restored staff member will receive the new password by email and must use it to sign in again."
            />

            <div className="rounded-lg border bg-muted/35 p-4 text-sm">
              <dl className="space-y-2">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd className="text-right font-medium">{request.data.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="break-all text-right font-medium">{request.data.email}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Role</dt>
                  <dd className="text-right font-medium">{getRoleLabel(request.data.role)}</dd>
                </div>
              </dl>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" disabled={restore.isPending} onClick={() => setRestoreRequest(undefined)}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={restore.isPending || !request}
            onClick={async () => {
              if (!request) return;
              await restore.mutateAsync({ id: request.staffId, data: request.data });
              setRestoreRequest(undefined);
            }}
          >
            {restore.isPending ? <LoadingSpinner /> : "Restore Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RestoreDeletedStaffDialog;
