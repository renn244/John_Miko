import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import MarkCompleteForm from "@/features/admin/maintenance/forms/MarkCompleteForm";
import { useCompleteMaintenanceMutation, useGetMaintenancebyId } from "@/features/admin/maintenance/hooks/useAdminMaintenance";
import { useMaintenanceStore } from "@/features/admin/maintenance/store/maintenanceAdmin.store";
import type { Maintenance } from "@/features/admin/maintenance/types/maintenance.type";

const MarkCompleteDialog = () => {
  const isCompleteOpen = useMaintenanceStore((state) => state.isCompleteOpen);
  const isCompleteId = useMaintenanceStore((state) => state.completeId);
  const setIsCompleteOpen = useMaintenanceStore((state) => state.setIsCompleteOpen); 
  const setCompleteId = useMaintenanceStore((state) => state.setCompleteId);

  const { data, isLoading, error, refetch, isRefetching } = useGetMaintenancebyId(isCompleteId);

  return (
    <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
      <DialogContent className="sm:max-w-xl" onCloseAutoFocus={() => setCompleteId(undefined)}>
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner className="size-10" />
          </div>
        )}
        {error && (
          <ErrorDialog 
          onBack={() => setIsCompleteOpen(false)}
          onRetry={refetch} retryLoading={isRefetching}
          />
        )}
        {(!data && !isLoading && !error && isCompleteOpen) && (
          <NotFoundDialog 
          onBack={() => setIsCompleteOpen(false)}
          onRetry={refetch} retryLoading={isRefetching}
          />
        )}
        {data && <MarkComplete maintenance={data} />}
      </DialogContent>
    </Dialog>
  )
}

const MarkComplete = ({ maintenance } : { maintenance: Maintenance }) => {
  const setIsCompleteOpen = useMaintenanceStore((state) => state.setIsCompleteOpen);
  
  const { mutateAsync } = useCompleteMaintenanceMutation(maintenance.id);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Mark as Complete
        </DialogTitle>
      </DialogHeader>
    
      <div className="space-y-4">

        <div className="flex gap-3">
          {maintenance.imagesUrl?.[0] ? (
            <img
            src={maintenance.imagesUrl[0]}
            alt={maintenance.title}
            className="h-20 w-20 object-cover rounded-md"
            />
          ) : (
            <div className="h-20 w-20 rounded-md border bg-muted/30" />
          )}

          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg">{maintenance.title}</h3>

            <p className="text-muted-foreground line-clamp-2">
              {maintenance.description}
            </p>
          </div>
        </div>

        <MarkCompleteForm 
        className="space-y-6 p-1"
        onsubmit={async (data) => mutateAsync(data, { onSuccess: () => setIsCompleteOpen(false) })}
        oncancel={() => setIsCompleteOpen(false)}
        />

      </div>
    </>
  )
}

export default MarkCompleteDialog
