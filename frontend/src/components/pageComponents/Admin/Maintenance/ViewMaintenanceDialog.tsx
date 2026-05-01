import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetMaintenancebyId } from "@/hooks/admin/maintenance.hook";
import { useMaintenanceStore } from "@/store/admin/maintenance.store";
import type { Maintenance } from "@/types/admin/maintenance.type";
import { format } from "date-fns";

const getStatusColor = (status: Maintenance["status"]) => {
  switch (status) {
    case "Pending":
      return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" };
    case "InProgress":
      return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" };
    case "Completed":
      return { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" };
    case "Closed":
      return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" };
  }
};

const getPriorityColor = (priority: Maintenance["priority"]) => {
  switch (priority) {
    case "Low":
      return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" };
    case "Medium":
      return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" };
    case "High":
      return { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-400" };
  }
};

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "PPpp");
};

const ViewMaintenanceDialog = () => {
  const isViewOpen = useMaintenanceStore((state) => state.isViewOpen);
  const viewId = useMaintenanceStore((state) => state.viewId);
  const setIsViewOpen = useMaintenanceStore((state) => state.setIsViewOpen);

  const { data, isLoading, error, refetch, isRefetching } = useGetMaintenancebyId(viewId);

  return (
    <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
      <DialogContent className="sm:max-w-2xl">
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner className="size-10" />
          </div>
        )}

        {error && (
          <ErrorDialog onBack={() => setIsViewOpen(false)} onRetry={refetch} retryLoading={isRefetching} />
        )}

        {!data && !isLoading && !error && isViewOpen && (
          <NotFoundDialog
            onBack={() => setIsViewOpen(false)}
            onRetry={refetch}
            retryLoading={isRefetching}
            title="Maintenance Ticket Not Found"
          />
        )}

        {data && <MaintenanceDetails maintenance={data} />}
      </DialogContent>
    </Dialog>
  );
};

const MaintenanceDetails = ({ maintenance }: { maintenance: Maintenance }) => {
  const setIsViewOpen = useMaintenanceStore((state) => state.setIsViewOpen);

  const statusColor = getStatusColor(maintenance.status);
  const priorityColor = getPriorityColor(maintenance.priority);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Maintenance Details</DialogTitle>
        <DialogDescription>Reference: {maintenance.id}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          {maintenance.imagesUrl?.[0] ? (
            <img
              src={maintenance.imagesUrl[0]}
              alt={maintenance.title}
              className="h-28 w-full rounded-lg object-cover sm:h-24 sm:w-24"
            />
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="text-lg font-semibold truncate">{maintenance.title}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge className={`${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                    {maintenance.status}
                  </Badge>
                  <Badge className={`${priorityColor.bg} ${priorityColor.text} ${priorityColor.border}`}>
                    {maintenance.priority}
                  </Badge>
                </div>
              </div>
            </div>

            {maintenance.description ? (
              <div className="mt-3 rounded-lg border bg-muted/40 p-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {maintenance.description}
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Created</div>
            <div className="text-sm font-medium">{formatDateTime(maintenance.createdAt)}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Updated</div>
            <div className="text-sm font-medium">{formatDateTime(maintenance.updatedAt)}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Started</div>
            <div className="text-sm font-medium">{formatDateTime(maintenance.startedAt)}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Resolved</div>
            <div className="text-sm font-medium">{formatDateTime(maintenance.resolvedAt)}</div>
          </div>
        </div>

        {maintenance.resolutionNotes ? (
          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Resolution Notes</div>
            <div className="mt-2 whitespace-pre-wrap text-sm">{maintenance.resolutionNotes}</div>
          </div>
        ) : null}

        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={() => setIsViewOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    </>
  );
};

export default ViewMaintenanceDialog;
