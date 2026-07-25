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
import { Link, useNavigate } from "react-router";
import {
  ACTIVE_MAINTENANCE_STATUSES,
  type ActiveMaintenanceStatus,
  formatMaintenanceShortDate,
  getMaintenanceStatusClasses,
  getMaintenanceStatusDate,
  getMaintenanceStatusLabel,
  sortMaintenanceByRelevantDate,
} from "./maintenanceDisplay";
import MaintenanceTicketCard from "./MaintenanceTicketCard";

const MaintenanceKanbanBoard = () => {
  const setCompleteId = useMaintenanceStore((state) => state.setCompleteId);
  const navigate = useNavigate();

  const startMutation = useStartMaintnenanceMutation();
  const closeMutation = useClosedMaintenanceMutation();

  const { data, isLoading } = useGetMaintenancesQuery({
    page: 1,
    limit: 100,
  });

  if (isLoading) {
    return (
      <div className="overflow-x-auto" role="status" aria-live="polite">
        <span className="sr-only">Loading maintenance board</span>
        <div className="grid min-w-225 grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-175 rounded-xl border bg-muted/60" />
          ))}
        </div>
      </div>
    );
  }

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
                      <MaintenanceTicketCard
                        key={ticket.id}
                        ticket={ticket}
                        actionSlot={
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                  <Link to={`/admin/maintenance/${ticket.id}/edit`}>
                                    <Edit className="h-4 w-4" />
                                    Edit Details
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />

                              <DropdownMenuItem onClick={() => navigate(`/admin/maintenance/${ticket.id}`)}>
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>

                              {ticket.status === "Pending" ? (
                                <DropdownMenuItem
                                  disabled={startMutation.isPending}
                                  onClick={() => startMutation.mutate(ticket.id)}
                                >
                                  <Play className="h-4 w-4" />
                                  Start Maintenance
                                </DropdownMenuItem>
                              ) : null}

                              {ticket.status === "InProgress" ? (
                                <DropdownMenuItem onClick={() => setCompleteId(ticket.id)}>
                                  <Check className="h-4 w-4" />
                                  Complete
                                </DropdownMenuItem>
                              ) : null}

                              {ticket.status === "Completed" ? (
                                <DropdownMenuItem
                                  disabled={closeMutation.isPending}
                                  onClick={() => closeMutation.mutate(ticket.id)}
                                >
                                  <Lock className="h-4 w-4" />
                                  Close Ticket
                                </DropdownMenuItem>
                              ) : null}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        }
                        footerLabel={getDateLabel(ticket.status)}
                        footerValue={
                          formatMaintenanceShortDate(
                            getMaintenanceStatusDate(ticket, ticket.status),
                          ) ?? "—"
                        }
                      />
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
