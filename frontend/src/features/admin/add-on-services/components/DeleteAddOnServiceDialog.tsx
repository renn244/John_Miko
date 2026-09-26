import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import AdminDecisionNotice from "@/components/common/AdminDecisionNotice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useDeleteAddOnServiceMutation, useGetAddOnServiceById } from "@/features/admin/add-on-services/hooks/useAddOnServiceAdmin";
import { useAddOnServiceAdminStore } from "@/features/admin/add-on-services/store/addOnServiceAdmin.store";
import type { AddOnService } from "@/features/shared/add-on-services/types/add-on-service.type";
import { AlertTriangle, Trash2 } from "lucide-react";

const DeleteAddOnServiceDialog = () => {
    const isDeleteOpen = useAddOnServiceAdminStore((state) => state.isDeleteOpen);
    const deleteId = useAddOnServiceAdminStore((state) => state.deleteId);
    const setIsDeleteOpen = useAddOnServiceAdminStore((state) => state.setIsDeleteOpen);
    const setDeleteId = useAddOnServiceAdminStore((state) => state.setDeleteId);

    const { data, isLoading, error, refetch, isRefetching } = useGetAddOnServiceById(deleteId);

    return (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="sm:max-w-xl" onCloseAutoFocus={() => setDeleteId(undefined)}>
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog onBack={() => setIsDeleteOpen(false)} onRetry={refetch} retryLoading={isRefetching} />
                )}
                {!data && !isLoading && !error && isDeleteOpen && (
                    <NotFoundDialog
                        onBack={() => setIsDeleteOpen(false)}
                        onRetry={refetch}
                        retryLoading={isRefetching}
                        title="Service Not Found"
                    />
                )}
                {data && <DeleteConfirmationAddOnService service={data} />}
            </DialogContent>
        </Dialog>
    );
};

const DeleteConfirmationAddOnService = ({ service }: { service: AddOnService }) => {
    const setDeleteId = useAddOnServiceAdminStore((state) => state.setDeleteId);
    const { mutateAsync: deleteService, isPending } = useDeleteAddOnServiceMutation(service.id);

    return (
        <>
            <DialogHeader>
                <DialogTitle>Delete Add-on Service</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <AdminDecisionNotice
                    tone="warning"
                    icon={AlertTriangle}
                    title="This cannot be restored through the admin app."
                    description="Deleting removes this service from future bookings. Existing booking records, prices, and quantities remain intact."
                />

                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="text-sm font-semibold mb-3">Service details:</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">{service.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-medium">{service.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-medium">₱{service.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-medium">{service.quantity}</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                    Do you want to permanently remove this add-on service from future bookings?
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" onClick={() => setDeleteId(undefined)} variant="outline">
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={async () => {
                        await deleteService();
                        setDeleteId(undefined);
                    }}
                    disabled={isPending}
                >
                    {isPending ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4" />
                            Delete Service
                        </>
                    )}
                </Button>
            </div>
        </>
    );
};

export default DeleteAddOnServiceDialog;
