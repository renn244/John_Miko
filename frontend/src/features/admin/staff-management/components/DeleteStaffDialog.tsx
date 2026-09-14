import AdminDecisionNotice from "@/components/common/AdminDecisionNotice";
import AdminAvailabilityBadge from "@/components/common/AdminAvailabilityBadge";
import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useDeleteStaffMutation, useGetStaffById } from "@/features/admin/staff-management/hooks/useStaffManagement";
import { useStaffManagementStore } from "@/features/admin/staff-management/store/staffManagementAdmin.store";
import type { StaffUser } from "@/features/admin/staff-management/types/staff-management.type";
import { AlertTriangle } from "lucide-react";

const DeleteStaffDialog = () => {
  const isOpen = useStaffManagementStore((state) => state.isDeleteOpen);
  const deleteId = useStaffManagementStore((state) => state.deleteId);
  const setIsOpen = useStaffManagementStore((state) => state.setIsDeleteOpen);
  const setDeleteId = useStaffManagementStore((state) => state.setDeleteId);
  const { data, isLoading, error, refetch, isRefetching } = useGetStaffById(deleteId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl" onCloseAutoFocus={() => setDeleteId(undefined)}>
        {!data ? (
          <DialogHeader className="sr-only">
            <DialogTitle>Delete Staff Account</DialogTitle>
            <DialogDescription>Loading the staff account to confirm deletion.</DialogDescription>
          </DialogHeader>
        ) : null}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner className="size-10" />
          </div>
        ) : null}
        {error ? (
          <ErrorDialog onBack={() => setIsOpen(false)} onRetry={refetch} retryLoading={isRefetching} />
        ) : null}
        {!data && !isLoading && !error && isOpen ? (
          <NotFoundDialog
            onBack={() => setIsOpen(false)}
            onRetry={refetch}
            retryLoading={isRefetching}
            title="Staff User Not Found"
          />
        ) : null}
        {data ? <DeleteStaff staff={data} /> : null}
      </DialogContent>
    </Dialog>
  );
};

const DeleteStaff = ({ staff }: { staff: StaffUser }) => {
  const setIsOpen = useStaffManagementStore((state) => state.setIsDeleteOpen);
  const { mutateAsync, isPending } = useDeleteStaffMutation(staff.id);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete Staff Account</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <AdminDecisionNotice
          tone="destructive"
          icon={AlertTriangle}
          title="This removes the account from Staff Management."
          description="The account cannot sign in. Its pending and in-progress maintenance tickets will become unassigned; historical records stay preserved."
        />

        <div className="rounded-lg border bg-muted/35 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Name:</span>
              <span className="text-right font-semibold">{staff.name || "Unnamed Staff"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Email:</span>
              <span className="break-all text-right font-medium">{staff.email}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Current status:</span>
              <AdminAvailabilityBadge active={staff.status === "ACTIVE"} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={isPending}
          onClick={async () => {
            await mutateAsync();
            setIsOpen(false);
          }}
        >
          {isPending ? <LoadingSpinner /> : "Delete Staff"}
        </Button>
      </div>
    </>
  );
};

export default DeleteStaffDialog;
