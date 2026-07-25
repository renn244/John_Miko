import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetGuestById, useReactivateGuestMutation } from "@/hooks/admin/guest-management/guest-management.hook";
import { useGuestManagementStore } from "@/store/admin/guestManagement.store";
import type { GuestUser } from "@/types/admin/guest-management.type";
import { UserCheck } from "lucide-react";

const ReactivateGuestDialog = () => {
    const isReactivateOpen = useGuestManagementStore((state) => state.isReactivateOpen);
    const reactivateId = useGuestManagementStore((state) => state.reactivateId);
    const setIsReactivateOpen = useGuestManagementStore((state) => state.setIsReactivateOpen);
    const setReactivateId = useGuestManagementStore((state) => state.setReactivateId);

    const { data, isLoading, error, refetch, isRefetching } = useGetGuestById(reactivateId);

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
                    title="Guest User Not Found"
                    />
                )}

                {data && <ReactivateGuest guest={data} />}
            </DialogContent>
        </Dialog>
    )
}

const ReactivateGuest = ({ guest }: { guest: GuestUser }) => {
    const setIsReactivateOpen = useGuestManagementStore((state) => state.setIsReactivateOpen);
    const { mutateAsync, isPending } = useReactivateGuestMutation(guest.id);

    const isInactive = guest.status === "INACTIVE";

    return (
        <>
            <DialogHeader>
                <DialogTitle>Reactivate Guest User</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border-2 border-emerald-300/70 bg-emerald-50">
                    <UserCheck className="w-6 h-6 shrink-0 mt-0.5 text-emerald-700" />
                    <div>
                        <h3 className="font-bold text-sm mb-1 text-emerald-700">
                            This will reactivate the guest account.
                        </h3>
                        <p className="text-sm text-emerald-700">
                            The guest user will be able to sign in again once reactivated.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="text-sm font-semibold mb-3">
                        Guest details:
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">{guest.name || "Unnamed Guest"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{guest.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge className={isInactive ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-emerald-100 text-emerald-700 border-emerald-300"}>
                                {isInactive ? "Inactive" : "Active"}
                            </Badge>
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
                onClick={async () => {
                    await mutateAsync();
                    setIsReactivateOpen(false);
                }}
                disabled={isPending || !isInactive}
                >
                    {isPending ? <LoadingSpinner /> : (isInactive ? "Reactivate" : "Already Active")}
                </Button>
            </div>
        </>
    )
}

export default ReactivateGuestDialog
