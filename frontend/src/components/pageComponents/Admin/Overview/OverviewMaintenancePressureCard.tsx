import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetMaintenanceOverviewQuery } from "@/hooks/admin/maintenance.hook";
import { cn } from "@/lib/utils";
import { CheckCircle2, Ticket } from "lucide-react";
import { SectionHeader, surfaceClassName } from "./Overview.shared";

const OverviewMaintenancePressureCard = ({
    selectedDate,
}: {
    selectedDate: string;
}) => {
    const maintenanceOverview = useGetMaintenanceOverviewQuery(selectedDate);
    const data = maintenanceOverview.data;
    const pendingCount = data?.statusCounts.Pending ?? 0;
    const inProgressCount = data?.statusCounts.InProgress ?? 0;
    const highPriorityCount = data?.highPriorityOpen ?? 0;
    const totalPressure = pendingCount + inProgressCount + highPriorityCount;

    const pressureSegments =
        totalPressure > 0
            ? [
                  {
                      label: "Pending",
                      value: pendingCount,
                      className: "bg-amber-400",
                      width: (pendingCount / totalPressure) * 100,
                  },
                  {
                      label: "In Progress",
                      value: inProgressCount,
                      className: "bg-blue-500",
                      width: (inProgressCount / totalPressure) * 100,
                  },
                  {
                      label: "High Priority",
                      value: highPriorityCount,
                      className: "bg-rose-500",
                      width: (highPriorityCount / totalPressure) * 100,
                  },
              ].filter((segment) => segment.value > 0)
            : [];

    return (
        <div className={cn(surfaceClassName, "p-4")}>
            <SectionHeader
                title="Maintenance Pressure"
                linkTo="/admin/maintenance"
                linkLabel="Open board"
            />
            {maintenanceOverview.isLoading ? (
                <LoadingSpinner
                    className="mt-4 size-5"
                    containerClassName="justify-start"
                />
            ) : (
                <div className="mt-4 space-y-5">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Open Workload
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                                {data?.openMaintenance ?? 0} open
                            </p>
                        </div>

                        <div className="h-3.5 overflow-hidden rounded-[2px] bg-muted">
                            {pressureSegments.length ? (
                                <div className="flex h-full w-full">
                                    {pressureSegments.map((segment) => (
                                        <div
                                            key={segment.label}
                                            className={segment.className}
                                            style={{ width: `${segment.width}%` }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full w-full bg-muted" />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {[
                            {
                                label: "Pending",
                                value: pendingCount,
                                dotClassName: "bg-amber-400",
                            },
                            {
                                label: "In Progress",
                                value: inProgressCount,
                                dotClassName: "bg-blue-500",
                            },
                            {
                                label: "High Priority",
                                value: highPriorityCount,
                                dotClassName: "bg-rose-500",
                            },
                        ].map((item) => (
                            <div key={item.label} className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "size-2 rounded-full",
                                            item.dotClassName,
                                        )}
                                    />
                                    <span className="truncate text-xs text-muted-foreground">
                                        {item.label}
                                    </span>
                                </div>
                                <p className="text-lg font-semibold tracking-tight text-foreground">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border/70 pt-4">
                        <p className="text-xs text-muted-foreground">Today</p>
                        <div className="mt-3 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 px-1 py-1">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600">
                                    <Ticket className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        New Tickets
                                    </p>
                                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                                        {data?.today.newTickets ?? 0}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-1 py-1">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
                                    <CheckCircle2 className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Resolved
                                    </p>
                                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                                        {data?.today.resolvedTickets ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewMaintenancePressureCard;
