import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useDeactivateGuestMutation, useGetGuestById } from "@/hooks/admin/guest-management/guest-management.hook";
import { useGuestManagementStore } from "@/store/admin/guestManagement.store";
import type { GuestUser } from "@/types/admin/guest-management.type";
import { AlertTriangle } from "lucide-react";

const DeactivateGuestDialog = () => {
    const isDeactivateOpen = useGuestManagementStore((state) => state.isDeactivateOpen);
    const deactivateId = useGuestManagementStore((state) => state.deactivateId);
    const setIsDeactivateOpen = useGuestManagementStore((state) => state.setIsDeactivateOpen);

    const { data, isLoading, error, refetch, isRefetching } = useGetGuestById(deactivateId);

    return (
        <Dialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
            <DialogContent className="sm:max-w-xl">
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog
                    onBack={() => setIsDeactivateOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error && isDeactivateOpen) && (
                    <NotFoundDialog
                    onBack={() => setIsDeactivateOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    title="Guest User Not Found"
                    />
                )}

                {data && <DeactivateGuest guest={data} />}
            </DialogContent>
        </Dialog>
    )
}

const DeactivateGuest = ({ guest }: { guest: GuestUser }) => {
    const setIsDeactivateOpen = useGuestManagementStore((state) => state.setIsDeactivateOpen);
    const { mutateAsync, isPending } = useDeactivateGuestMutation(guest.id);

    const isInactive = guest.status === "INACTIVE";

    return (
        <>
            <DialogHeader>
                <DialogTitle>Deactivate Guest User</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border-2 border-destructive/50 bg-destructive/20">
                    <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-destructive/75" />
                    <div>
                        <h3 className="font-bold text-sm mb-1 text-destructive/75">
                            Warning: This action will deactivate the guest account.
                        </h3>
                        <p className="text-sm text-destructive/75">
                            The guest user will no longer be able to sign in once deactivated.
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
                <Button type="button" onClick={() => setIsDeactivateOpen(false)} variant="outline">
                    Cancel
                </Button>
                <Button
                type="button"
                variant="destructive"
                onClick={async () => {
                    await mutateAsync();
                    setIsDeactivateOpen(false);
                }}
                disabled={isPending || isInactive}
                >
                    {isPending ? <LoadingSpinner /> : (isInactive ? "Already Inactive" : "Deactivate")}
                </Button>
            </div>
        </>
    )
}

export default DeactivateGuestDialog
