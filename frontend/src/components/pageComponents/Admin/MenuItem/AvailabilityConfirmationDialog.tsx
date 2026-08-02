import ErrorDialog from "@/components/common/dialog/ErrorDialog"
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog"
import AdminAvailabilityBadge from "@/components/common/AdminAvailabilityBadge"
import AdminDecisionNotice from "@/components/common/AdminDecisionNotice"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { useGetMenuItemById, useUpdateMenuItemAvailabilityMutation } from "@/hooks/admin/menu-item.hook"
import { useMenuItemAdminStore } from "@/store/admin/menuItemAdmin.store"
import type { MenuItem } from "@/types/admin/menu-item.type"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

const AvailabilityConfirmationDialog = () => {
    const isAvailabilityConfirmationOpen = useMenuItemAdminStore((state) => state.isAvailabilityConfirmationOpen)
    const availabilityConfirmationId = useMenuItemAdminStore((state) => state.availabilityConfirmationId)
    const setIsAvailabilityConfirmationOpen = useMenuItemAdminStore((state) => state.setIsAvailabilityConfirmationOpen)
    const setAvailabilityConfirmationId = useMenuItemAdminStore((state) => state.setAvailabilityConfirmationId)

    const { data, isLoading, error, refetch, isRefetching } = useGetMenuItemById(availabilityConfirmationId);

    return (
        <Dialog open={isAvailabilityConfirmationOpen} onOpenChange={setIsAvailabilityConfirmationOpen}>
            <DialogContent className="sm:max-w-xl" onCloseAutoFocus={() => setAvailabilityConfirmationId(undefined)}>
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog 
                    onBack={() => setIsAvailabilityConfirmationOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error && isAvailabilityConfirmationOpen) && (
                    <NotFoundDialog 
                    onBack={() => setIsAvailabilityConfirmationOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    title="Menu Item Not Found"
                    />
                )}

                {data && <AvailabilityConfirmationMenuItem menuItem={data} />}
            </DialogContent>
        </Dialog>
    )
}

const AvailabilityConfirmationMenuItem = ({ menuItem } : { menuItem: MenuItem }) => {
    const setIsAvailabilityConfirmationOpen = useMenuItemAdminStore((state) => state.setIsAvailabilityConfirmationOpen);
    const confirmationId = useMenuItemAdminStore((state) => state.availabilityConfirmationId);

    const isMarkingUnavailable = menuItem.availability === 'Available';
    const newStatus = isMarkingUnavailable ? 'Unavailable' : 'Available';

    const { mutateAsync, isPending } = useUpdateMenuItemAvailabilityMutation(confirmationId!);

    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Mark as {newStatus}
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                
                <AdminDecisionNotice
                    tone={isMarkingUnavailable ? "warning" : "success"}
                    icon={isMarkingUnavailable ? AlertTriangle : CheckCircle}
                    title={isMarkingUnavailable ? "Warning: You still need to process existing preorders!" : "Confirm Item Availability"}
                    description={
                        isMarkingUnavailable
                            ? "You still need to process existing preorders for this item. Please coordinate with the kitchen staff."
                            : "This item will become available for guests to preorder immediately."
                    }
                />

                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="text-sm font-semibold mb-3">
                        Menu Item Details:
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">
                                {menuItem.name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-medium">
                                {menuItem.id}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-medium capitalize">
                                {menuItem.category}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-medium">
                                ₱{menuItem.price.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-muted-foreground">Current Status:</span>
                        <AdminAvailabilityBadge
                            active={menuItem.availability === "Available"}
                            activeLabel="Available"
                            inactiveLabel="Unavailable"
                        />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">New Status:</span>
                        <AdminAvailabilityBadge
                            active={!isMarkingUnavailable}
                            activeLabel="Available"
                            inactiveLabel="Unavailable"
                        />
                        </div>
                    </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                    Do you want to proceed with this change?
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" onClick={() => setIsAvailabilityConfirmationOpen(false)} variant="outline">
                    Cancel
                </Button>
                <Button
                type="button"
                disabled={isPending}
                onClick={async () => {
                    await mutateAsync(newStatus)
                    setIsAvailabilityConfirmationOpen(false)
                }}
                variant={isMarkingUnavailable ? "warning" : "success"}
                >
                    {
                        isPending ? 
                            <LoadingSpinner /> :
                            <>
                                {isMarkingUnavailable ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                Yes, Mark as {newStatus}
                            </>
                    }
                </Button>
            </div>
        </>
    )
}

export default AvailabilityConfirmationDialog
