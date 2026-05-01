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
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { useClosedMaintenanceMutation, useGetMaintenancesQuery, useStartMaintnenanceMutation } from "@/hooks/admin/maintenance.hook";
import { useMaintenanceStore } from "@/store/admin/maintenance.store";
import type { Maintenance } from "@/types/admin/maintenance.type";
import { format } from "date-fns";
import { Check, Edit, Lock, MoreHorizontal, Play } from "lucide-react";
import { Link } from "react-router";

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

const getStatusAccent = (status: Exclude<Maintenance["status"], "Closed">) => {
  switch (status) {
    case "Pending":
      return { barBg: "bg-yellow-300" };
    case "InProgress":
      return { barBg: "bg-blue-300" };
    case "Completed":
      return { barBg: "bg-green-300" };
  }
};

const getPriorityAccentBorder = (priority: Maintenance["priority"]) => {
  switch (priority) {
    case "Low":
      return "border-gray-300";
    case "Medium":
      return "border-yellow-300";
    case "High":
      return "border-orange-400";
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

const COLUMN_ORDER: Array<Exclude<Maintenance["status"], "Closed">> = [
  "Pending",
  "InProgress",
  "Completed",
];

const COLUMN_LABEL: Record<Exclude<Maintenance["status"], "Closed">, string> = {
  Pending: "Pending",
  InProgress: "In Progress",
  Completed: "Completed",
};

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

  const tickets = (data?.data ?? []).filter((t) => t.status !== "Closed");

  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-6">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No tickets to show</EmptyTitle>
            <EmptyDescription>Closed tickets are excluded from this board.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const ticketsByStatus = COLUMN_ORDER.reduce(
    (acc, s) => {
      acc[s] = tickets.filter((t) => t.status === s);
      return acc;
    },
    {} as Record<Exclude<Maintenance["status"], "Closed">, Maintenance[]>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Maintenance Kanban</h2>
          <p className="text-sm text-muted-foreground">Closed tickets are excluded from this board.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {tickets.length} ticket{tickets.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-225 grid-cols-3 gap-4">
          {COLUMN_ORDER.map((columnStatus) => {
            const columnTickets = ticketsByStatus[columnStatus];
            const statusColor = getStatusColor(columnStatus);
            const accent = getStatusAccent(columnStatus);

            return (
              <div
                key={columnStatus}
                className="overflow-hidden rounded-xl border bg-muted/30 h-175"
              >
                <div className={`h-2 w-full ${accent.barBg}`} />
                <div className="bg-background/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{COLUMN_LABEL[columnStatus]}</h3>
                      <span className="text-sm text-muted-foreground">({columnTickets.length})</span>
                    </div>
                    <Badge className={`${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                      {COLUMN_LABEL[columnStatus]}
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
                    className={`rounded-xl bg-background p-3 shadow-sm border-l-4 ${getPriorityAccentBorder(ticket.priority)}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{ticket.title}</div>
                          <div className="text-xs text-muted-foreground truncate">ID: {ticket.id}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                          className={`${getPriorityColor(ticket.priority).bg} ${
                            getPriorityColor(ticket.priority).text
                          } ${getPriorityColor(ticket.priority).border}`}
                          >
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
                                    <Edit className="w-4 h-4 text-primary" />
                                    Edit Details
                                  </DropdownMenuItem>
                                </Link>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />

                              <DropdownMenuItem onClick={() => setViewId(ticket.id)}>
                                View Details
                              </DropdownMenuItem>

                              {ticket.status === "Pending" && (
                                <DropdownMenuItem
                                  disabled={startMutation.isPending}
                                  onClick={() => startMutation.mutate(ticket.id)}
                                >
                                  <Play className="w-4 h-4 text-primary" />
                                  Start Maintenance
                                </DropdownMenuItem>
                              )}

                              {ticket.status === "InProgress" && (
                                <DropdownMenuItem onClick={() => setCompleteId(ticket.id)}>
                                  <Check className="w-4 h-4 text-emerald-500" />
                                  Complete
                                </DropdownMenuItem>
                              )}

                              {ticket.status === "Completed" && (
                                <DropdownMenuItem
                                  disabled={closeMutation.isPending}
                                  onClick={() => closeMutation.mutate(ticket.id)}
                                >
                                  <Lock className="w-4 h-4 text-amber-500" />
                                  Close Ticket
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {ticket.description ? (
                        <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {ticket.description}
                        </div>
                      ) : null}

                      <div className="mt-2 text-xs text-muted-foreground">
                        Created: {format(new Date(ticket.createdAt), "MMM dd, yyyy")}
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

export default MaintenanceKanbanBoard;
