import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AssignedMaintenance } from "@/features/staff/maintenance/types/maintenance.type";
import {
  formatMaintenanceDateTimeLabel,
  getMaintenancePriorityAccentClassName,
  getMaintenancePriorityChipClassName,
  getMaintenanceStatusChipClassName,
  getMaintenanceStatusLabel,
  getRelevantMaintenanceDate,
} from "./maintenanceDisplay";
import { Link } from "react-router";

type MaintenanceTicketCardProps = {
  ticket: AssignedMaintenance;
  variant?: "list" | "board";
  detailPath?: string;
};

const MaintenanceTicketCard = ({
  ticket,
  variant = "list",
  detailPath,
}: MaintenanceTicketCardProps) => {
  const content = (
    <article
      className="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
      aria-label={`Maintenance ticket ${ticket.id}: ${ticket.title}`}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          getMaintenancePriorityAccentClassName(ticket.priority),
        )}
      />

      <div
        className={cn(
          "space-y-3 p-4 pl-5",
          variant === "board" && "lg:min-h-[150px]",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-muted-foreground">
              ID: {ticket.id}
            </p>
            <h2
              className={cn(
                "mt-1 text-lg font-bold leading-6 text-foreground",
                variant === "board" && "lg:text-base",
              )}
            >
              {ticket.title}
            </h2>
          </div>

          <Badge
            className={cn(
              "shrink-0 border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-none",
              getMaintenancePriorityChipClassName(ticket.priority),
            )}
          >
            {ticket.priority}
          </Badge>
        </div>

        <p
          className={cn(
            "line-clamp-2 text-sm leading-5 text-muted-foreground",
            variant === "board" && "lg:line-clamp-1",
          )}
        >
          {ticket.description}
        </p>

        <div className="border-t border-border/80" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-muted-foreground">
            {formatMaintenanceDateTimeLabel(getRelevantMaintenanceDate(ticket))}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                "border px-2.5 py-1 text-xs font-semibold shadow-none",
                getMaintenanceStatusChipClassName(ticket.status),
              )}
            >
              {getMaintenanceStatusLabel(ticket.status)}
            </Badge>
            <Badge className="border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-none">
              {ticket.expertise}
            </Badge>
          </div>
        </div>
      </div>
    </article>
  );
  return detailPath ? (
    <Link
      to={detailPath}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {content}
    </Link>
  ) : (
    content
  );
};

export default MaintenanceTicketCard;
