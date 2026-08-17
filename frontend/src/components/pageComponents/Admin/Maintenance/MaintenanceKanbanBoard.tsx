import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useState } from "react";
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
  const [mobileStatus, setMobileStatus] = useState<ActiveMaintenanceStatus>("Pending");

  const startMutation = useStartMaintnenanceMutation();
  const closeMutation = useClosedMaintenanceMutation();

  const { data, isLoading } = useGetMaintenancesQuery({
    page: 1,
    limit: 100,
  });

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">Loading maintenance board</span>
        <div className="space-y-3 p-1 md:hidden">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-xl border bg-muted/60" />
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <div className="grid min-w-225 grid-cols-3 gap-4 animate-pulse">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-175 rounded-xl border bg-muted/60" />
            ))}
          </div>
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

  const ticketActions = (ticket: Maintenance) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${ticket.title}`}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to={`/admin/maintenance/${ticket.id}/edit`}>
              <Edit className="size-4" />
              Edit Details
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(`/admin/maintenance/${ticket.id}`)}>
          <Eye className="size-4" />
          View Details
        </DropdownMenuItem>
        {ticket.status === "Pending" ? (
          <DropdownMenuItem
            disabled={startMutation.isPending}
            onClick={() => startMutation.mutate(ticket.id)}
          >
            <Play className="size-4" />
            Start Maintenance
          </DropdownMenuItem>
        ) : null}
        {ticket.status === "InProgress" ? (
          <DropdownMenuItem onClick={() => setCompleteId(ticket.id)}>
            <Check className="size-4" />
            Complete
          </DropdownMenuItem>
        ) : null}
        {ticket.status === "Completed" ? (
          <DropdownMenuItem
            disabled={closeMutation.isPending}
            onClick={() => closeMutation.mutate(ticket.id)}
          >
            <Lock className="size-4" />
            Close Ticket
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-3">
      <Tabs
        value={mobileStatus}
        onValueChange={(value) => setMobileStatus(value as ActiveMaintenanceStatus)}
        className="md:hidden"
      >
        <TabsList className="grid h-auto w-full grid-cols-3">
          {ACTIVE_MAINTENANCE_STATUSES.map((status) => (
            <TabsTrigger key={status} value={status} className="px-1 text-xs">
              {getMaintenanceStatusLabel(status)}
              <span className="text-muted-foreground">{ticketsByStatus[status].length}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={mobileStatus} className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{getMaintenanceStatusLabel(mobileStatus)}</h3>
            <Badge className={getMaintenanceStatusClasses(mobileStatus)}>
              {ticketsByStatus[mobileStatus].length} tickets
            </Badge>
          </div>
          {ticketsByStatus[mobileStatus].length === 0 ? (
            <div className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">
              No tickets in this status.
            </div>
          ) : ticketsByStatus[mobileStatus].map((ticket) => (
            <MaintenanceTicketCard
              key={ticket.id}
              ticket={ticket}
              actionSlot={ticketActions(ticket)}
              footerLabel={getDateLabel(ticket.status)}
              footerValue={formatMaintenanceShortDate(getMaintenanceStatusDate(ticket, ticket.status)) ?? "—"}
            />
          ))}
        </TabsContent>
      </Tabs>

      <div className="hidden overflow-x-auto md:block">
        <div className="grid min-w-225 grid-cols-3 gap-4">
          {ACTIVE_MAINTENANCE_STATUSES.map((columnStatus) => {
            const columnTickets = ticketsByStatus[columnStatus];

            return (
              <div
                key={columnStatus}
                className="flex h-175 flex-col overflow-hidden rounded-xl border bg-muted/30"
              >
                <div className={`h-2 w-full ${getColumnAccent(columnStatus)}`} />
                <div className="shrink-0 bg-background/60 p-4">
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

                </div>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                  {columnTickets.length === 0 ? (
                    <div className="rounded-lg border border-dashed bg-background/70 p-4 text-sm text-muted-foreground">
                      No tickets
                    </div>
                  ) : null}

                  {columnTickets.map((ticket) => (
                    <MaintenanceTicketCard
                      key={ticket.id}
                      ticket={ticket}
                      actionSlot={ticketActions(ticket)}
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
