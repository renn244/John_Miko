import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetAddOnServiceById, useUpdateAddOnServiceAvailabilityMutation } from "@/hooks/admin/add-on-service.hook";
import { useAddOnServiceAdminStore } from "@/store/admin/addOnServiceAdmin.store";
import type { AddOnService } from "@/types/admin/add-on-service.type";
import { AlertTriangle, Power, RotateCcw } from "lucide-react";

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
    const setIsDeleteOpen = useAddOnServiceAdminStore((state) => state.setIsDeleteOpen);
    const nextIsActive = !service.isActive;
    const { mutateAsync: updateAvailability, isPending } = useUpdateAddOnServiceAvailabilityMutation(service.id);

    return (
        <>
            <DialogHeader>
                <DialogTitle>{service.isActive ? "Deactivate Add-on Service" : "Reactivate Add-on Service"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <div className={`flex items-start gap-4 p-4 rounded-lg border-2 ${
                    service.isActive
                        ? "border-amber-500/50 bg-amber-500/10"
                        : "border-emerald-500/40 bg-emerald-500/10"
                }`}>
                    {service.isActive ? (
                        <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-amber-700" />
                    ) : (
                        <RotateCcw className="w-6 h-6 shrink-0 mt-0.5 text-emerald-700" />
                    )}
                    <div>
                        <h3 className={`font-bold text-sm mb-1 ${service.isActive ? "text-amber-700" : "text-emerald-700"}`}>
                            {service.isActive ? "This service will be hidden from future bookings." : "This service will become bookable again."}
                        </h3>
                        <p className={`text-sm ${service.isActive ? "text-amber-700" : "text-emerald-700"}`}>
                            {service.isActive
                                ? "Deactivating keeps booking history intact while removing the service from new guest selections."
                                : "Reactivating makes the service visible again in guest add-on availability when stock allows."}
                        </p>
                    </div>
                </div>

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
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium">{service.isActive ? "Active" : "Inactive"}</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                    {service.isActive
                        ? "Do you want to deactivate this add-on service?"
                        : "Do you want to reactivate this add-on service?"}
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" onClick={() => setIsDeleteOpen(false)} variant="outline">
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant={service.isActive ? "destructive" : "default"}
                    onClick={async () => {
                        await updateAvailability({ isActive: nextIsActive });
                        setIsDeleteOpen(false);
                    }}
                    disabled={isPending}
                >
                    {isPending ? (
                        <LoadingSpinner />
                    ) : service.isActive ? (
                        <>
                            <Power className="w-4 h-4" />
                            Deactivate
                        </>
                    ) : (
                        <>
                            <RotateCcw className="w-4 h-4" />
                            Reactivate
                        </>
                    )}
                </Button>
            </div>
        </>
    );
};

export default DeleteAddOnServiceDialog;
