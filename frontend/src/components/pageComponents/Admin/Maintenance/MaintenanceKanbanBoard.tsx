import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useClosedMaintenanceMutation,
  useGetMaintenancesQuery,
  useStartMaintnenanceMutation,
} from "@/hooks/admin/maintenance.hook";
import { useMaintenanceStore } from "@/store/admin/maintenance.store";
import type { Maintenance } from "@/types/admin/maintenance.type";
import { Check, Edit, Eye, Lock, MoreHorizontal, Play } from "lucide-react";
import { Link } from "react-router";
import {
  ACTIVE_MAINTENANCE_STATUSES,
  type ActiveMaintenanceStatus,
  formatMaintenanceShortDate,
  getMaintenanceAssigneeLabel,
  getMaintenancePriorityAccentBorder,
  getMaintenancePriorityClasses,
  getMaintenanceStatusClasses,
  getMaintenanceStatusDate,
  getMaintenanceStatusLabel,
  sortMaintenanceByRelevantDate,
} from "./maintenanceDisplay";

const MaintenanceKanbanBoard = () => {
  const setViewId = useMaintenanceStore((state) => state.setViewId);
  const setCompleteId = useMaintenanceStore((state) => state.setCompleteId);

  const startMutation = useStartMaintnenanceMutation();
  const closeMutation = useClosedMaintenanceMutation();

  const { data, isLoading } = useGetMaintenancesQuery({
    page: 1,
    limit: 100,
  });

  if (isLoading) return null;

  const tickets = sortMaintenanceByRelevantDate(
    (data?.data ?? []).filter((ticket) => ticket.status !== "Closed"),
  );

  const ticketsByStatus = ACTIVE_MAINTENANCE_STATUSES.reduce(
    (acc, status) => {
      acc[status] = tickets.filter((ticket) => ticket.status === status);
      return acc;
    },
    {} as Record<ActiveMaintenanceStatus, Maintenance[]>,
  );

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <div className="grid min-w-225 grid-cols-3 gap-4">
          {ACTIVE_MAINTENANCE_STATUSES.map((columnStatus) => {
            const columnTickets = ticketsByStatus[columnStatus];

            return (
              <div
                key={columnStatus}
                className="h-175 overflow-hidden rounded-xl border bg-muted/30"
              >
                <div className={`h-2 w-full ${getColumnAccent(columnStatus)}`} />
                <div className="bg-background/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {getMaintenanceStatusLabel(columnStatus)}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        ({columnTickets.length})
                      </span>
                    </div>
                    <Badge className={getMaintenanceStatusClasses(columnStatus)}>
                      {getMaintenanceStatusLabel(columnStatus)}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-3">
                    {columnTickets.length === 0 ? (
                      <div className="rounded-lg border border-dashed bg-background/70 p-4 text-sm text-muted-foreground">
                        No tickets
                      </div>
                    ) : null}

                    {columnTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className={`rounded-xl border-l-4 bg-background p-3 shadow-sm ${getMaintenancePriorityAccentBorder(ticket.priority)}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate font-medium">{ticket.title}</div>
                            <div className="truncate text-xs text-muted-foreground">
                              ID: {ticket.id}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className={getMaintenancePriorityClasses(ticket.priority)}>
                              {ticket.priority}
                            </Badge>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuGroup>
                                  <Link to={`/admin/maintenance/${ticket.id}/edit`}>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 text-primary" />
                                      Edit Details
                                    </DropdownMenuItem>
                                  </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={() => setViewId(ticket.id)}>
                                  <Eye className="h-4 w-4 text-primary" />
                                  View Details
                                </DropdownMenuItem>

                                {ticket.status === "Pending" ? (
                                  <DropdownMenuItem
                                    disabled={startMutation.isPending}
                                    onClick={() => startMutation.mutate(ticket.id)}
                                  >
                                    <Play className="h-4 w-4 text-primary" />
                                    Start Maintenance
                                  </DropdownMenuItem>
                                ) : null}

                                {ticket.status === "InProgress" ? (
                                  <DropdownMenuItem onClick={() => setCompleteId(ticket.id)}>
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    Complete
                                  </DropdownMenuItem>
                                ) : null}

                                {ticket.status === "Completed" ? (
                                  <DropdownMenuItem
                                    disabled={closeMutation.isPending}
                                    onClick={() => closeMutation.mutate(ticket.id)}
                                  >
                                    <Lock className="h-4 w-4 text-amber-500" />
                                    Close Ticket
                                  </DropdownMenuItem>
                                ) : null}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {ticket.description ? (
                          <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {ticket.description}
                          </div>
                        ) : null}

                        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium text-foreground/80">Expertise:</span>{" "}
                            <span>{ticket.expertise}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground/80">Assigned:</span>{" "}
                            <span>{getMaintenanceAssigneeLabel(ticket)}</span>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                          {getDateLabel(ticket.status)}:{" "}
                          {formatMaintenanceShortDate(
                            getMaintenanceStatusDate(ticket, ticket.status),
                          ) ?? "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const getColumnAccent = (status: ActiveMaintenanceStatus) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-300";
    case "InProgress":
      return "bg-blue-300";
    case "Completed":
      return "bg-green-300";
  }
};

const getDateLabel = (status: Maintenance["status"]) => {
  switch (status) {
    case "Pending":
      return "Created";
    case "InProgress":
      return "Started";
    case "Completed":
      return "Resolved";
    case "Closed":
      return "Closed";
  }
};

export default MaintenanceKanbanBoard;
