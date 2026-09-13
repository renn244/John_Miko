import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useDeleteMenuItemMutation, useGetMenuItemById } from "@/features/admin/menu-items/hooks/useMenuItemAdmin";
import { useMenuItemAdminStore } from "@/features/admin/menu-items/store/menuItemAdmin.store";
import type { MenuItem } from "@/features/shared/menu-items/types/menu-item.type";
import { AlertTriangle } from "lucide-react";

const DeleteMenuItemDialog = () => {
    const isDeleteOpen = useMenuItemAdminStore((state) => state.isDeleteOpen);
    const deleteId = useMenuItemAdminStore((state) => state.deleteId);
    const setIsDeleteOpen = useMenuItemAdminStore((state) => state.setIsDeleteOpen);
    const setDeleteId = useMenuItemAdminStore((state) => state.setDeleteId);
    
    const { data, isLoading, error, refetch, isRefetching } = useGetMenuItemById(deleteId);

    return (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="sm:max-w-xl" onCloseAutoFocus={() => setDeleteId(undefined)}>
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog 
                    onBack={() => setIsDeleteOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error && isDeleteOpen) && (
                    <NotFoundDialog 
                    onBack={() => setIsDeleteOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    title="Menu Item Not Found"
                    />
                )}
                {data && <DeleteConfirmationMenuItem menuItem={data} />}
            </DialogContent>
        </Dialog>
    )
}

const DeleteConfirmationMenuItem = ({ menuItem } : { menuItem: MenuItem }) => {
    const setIsDeleteOpen = useMenuItemAdminStore((state) => state.setIsDeleteOpen);

    const { mutateAsync: deleteMenuItem, isPending } = useDeleteMenuItemMutation(menuItem.id);

    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Delete Menu Item
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

                <div className="flex items-start gap-4 p-4 rounded-lg border-2 border-destructive/50 bg-destructive/20">
                    <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-destructive/75" />
                    <div>
                        <h3 className="font-bold text-sm mb-1 text-destructive/75">
                            Warning: This action cannot be undone!
                        </h3>
                        <p className="text-sm text-destructive/75">
                            Deleting this menu item will permanently remove it from the system.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="text-sm font-semibold mb-3">
                        Menu item to be deleted:
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
                    </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                    Are you absolutely sure you want to proceed with this deletion?
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" onClick={() => setIsDeleteOpen(false)} variant="outline">
                    Cancel
                </Button>
                <Button 
                type="button"
                variant="destructive"
                onClick={async () => {
                    await deleteMenuItem();
                    setIsDeleteOpen(false);
                }} 
                disabled={isPending} 
                >
                    {isPending ? <LoadingSpinner /> : 'Delete Permanently'}
                </Button>
            </div>
        </>
    )
}

export default DeleteMenuItemDialog
