import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import AdminAvailabilityBadge from "@/components/common/AdminAvailabilityBadge";
import AdminDecisionNotice from "@/components/common/AdminDecisionNotice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
  useGetAddOnServiceById,
  useUpdateAddOnServiceAvailabilityMutation,
} from "@/features/admin/add-on-services/hooks/useAddOnServiceAdmin";
import { useAddOnServiceAdminStore } from "@/features/admin/add-on-services/store/addOnServiceAdmin.store";
import type { AddOnService } from "@/features/shared/add-on-services/types/add-on-service.type";
import { AlertTriangle, Power, RotateCcw } from "lucide-react";

const AddOnServiceAvailabilityDialog = () => {
  const isAvailabilityOpen = useAddOnServiceAdminStore(
    (state) => state.isAvailabilityOpen,
  );
  const availabilityId = useAddOnServiceAdminStore(
    (state) => state.availabilityId,
  );
  const setIsAvailabilityOpen = useAddOnServiceAdminStore(
    (state) => state.setIsAvailabilityOpen,
  );
  const setAvailabilityId = useAddOnServiceAdminStore(
    (state) => state.setAvailabilityId,
  );
  const { data, isLoading, error, refetch, isRefetching } =
    useGetAddOnServiceById(availabilityId);

  return (
    <Dialog open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
      <DialogContent
        className="sm:max-w-xl"
        onCloseAutoFocus={() => setAvailabilityId(undefined)}
      >
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner className="size-10" />
          </div>
        )}
        {error && (
          <ErrorDialog
            onBack={() => setIsAvailabilityOpen(false)}
            onRetry={refetch}
            retryLoading={isRefetching}
          />
        )}
        {!data && !isLoading && !error && isAvailabilityOpen && (
          <NotFoundDialog
            onBack={() => setIsAvailabilityOpen(false)}
            onRetry={refetch}
            retryLoading={isRefetching}
            title="Service Not Found"
          />
        )}
        {data && <AvailabilityConfirmation service={data} />}
      </DialogContent>
    </Dialog>
  );
};

const AvailabilityConfirmation = ({ service }: { service: AddOnService }) => {
  const setAvailabilityId = useAddOnServiceAdminStore(
    (state) => state.setAvailabilityId,
  );
  const nextIsActive = !service.isActive;
  const { mutateAsync: updateAvailability, isPending } =
    useUpdateAddOnServiceAvailabilityMutation(service.id);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {service.isActive
            ? "Deactivate Add-on Service"
            : "Reactivate Add-on Service"}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <AdminDecisionNotice
          tone={service.isActive ? "warning" : "success"}
          icon={service.isActive ? AlertTriangle : RotateCcw}
          title={
            service.isActive
              ? "This service will be hidden from future bookings."
              : "This service will become bookable again."
          }
          description={
            service.isActive
              ? "Deactivating keeps booking history intact while removing the service from new guest selections."
              : "Reactivating makes the service visible again in guest add-on availability when stock allows."
          }
        />
        <div className="rounded-lg border bg-gray-50 p-4">
          <h4 className="mb-3 text-sm font-semibold">Service details:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-semibold">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <AdminAvailabilityBadge active={service.isActive} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          onClick={() => setAvailabilityId(undefined)}
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant={service.isActive ? "warning" : "success"}
          onClick={async () => {
            await updateAvailability({ isActive: nextIsActive });
            setAvailabilityId(undefined);
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

export default AddOnServiceAvailabilityDialog;
