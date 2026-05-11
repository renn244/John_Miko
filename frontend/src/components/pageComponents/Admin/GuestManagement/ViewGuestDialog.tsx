import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetGuestById } from "@/hooks/admin/guest-management/guest-management.hook";
import { useGuestManagementStore } from "@/store/admin/guestManagement.store";
import type { GuestUser } from "@/types/admin/guest-management.type";
import { format } from "date-fns";

const ViewGuestDialog = () => {
    const isViewOpen = useGuestManagementStore((state) => state.isViewOpen);
    const viewId = useGuestManagementStore((state) => state.viewId);
    const setIsViewOpen = useGuestManagementStore((state) => state.setIsViewOpen);

    const { data, isLoading, error, refetch, isRefetching } = useGetGuestById(viewId);

    return (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent className="sm:max-w-xl">
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog
                    onBack={() => setIsViewOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error && isViewOpen) && (
                    <NotFoundDialog
                    onBack={() => setIsViewOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    title="Guest User Not Found"
                    />
                )}

                {data && <ViewGuest guest={data} />}
            </DialogContent>
        </Dialog>
    )
}

const ViewGuest = ({ guest }: { guest: GuestUser }) => {
    const setIsViewOpen = useGuestManagementStore((state) => state.setIsViewOpen);
    const isInactive = guest.status === "INACTIVE";

    return (
        <>
            <DialogHeader>
                <DialogTitle>Guest Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="text-sm font-semibold mb-3">
                        Guest information:
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-6">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold text-right">{guest.name || "Unnamed Guest"}</span>
                        </div>
                        <div className="flex justify-between gap-6">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium text-right break-all">{guest.email}</span>
                        </div>
                        <div className="flex justify-between gap-6">
                            <span className="text-muted-foreground">Contact No:</span>
                            <span className="font-medium text-right">{guest.contactNo}</span>
                        </div>
                        <div className="flex justify-between gap-6">
                            <span className="text-muted-foreground">Bookings:</span>
                            <span className="font-medium text-right">{guest.bookingCount}</span>
                        </div>
                        <div className="flex justify-between gap-6">
                            <span className="text-muted-foreground">Registered:</span>
                            <span className="font-medium text-right">{format(new Date(guest.createdAt), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex justify-between gap-6">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge className={isInactive ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-emerald-100 text-emerald-700 border-emerald-300"}>
                                {isInactive ? "Inactive" : "Active"}
                            </Badge>
                        </div>
                        <div className="flex justify-between gap-6">
                            <span className="text-muted-foreground">User ID:</span>
                            <span className=" text-xs text-right break-all">{guest.id}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" onClick={() => setIsViewOpen(false)}>
                    Close
                </Button>
            </div>
        </>
    )
}

export default ViewGuestDialog
