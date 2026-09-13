import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Maintenance } from "@/features/admin/maintenance/types/maintenance.type";
import type { ReactNode } from "react";
import {
  getMaintenanceAssigneeLabel,
  getMaintenancePriorityAccentBorder,
  getMaintenancePriorityClasses,
} from "./maintenanceDisplay";

type MaintenanceTicketCardProps = {
  ticket: Maintenance;
  actionSlot?: ReactNode;
  className?: string;
  idLabel?: string;
  footerLabel?: string;
  footerValue?: string;
};

const MaintenanceTicketCard = ({
  ticket,
  actionSlot,
  className,
  idLabel,
  footerLabel,
  footerValue,
}: MaintenanceTicketCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border-l-[3px] bg-background p-3 shadow-sm",
        getMaintenancePriorityAccentBorder(ticket.priority),
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-medium">{ticket.title}</div>
          <div className="truncate text-xs text-muted-foreground">
            {idLabel ?? `ID: ${ticket.id}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getMaintenancePriorityClasses(ticket.priority)}>
            {ticket.priority}
          </Badge>
          {actionSlot}
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

      {footerLabel && footerValue ? (
        <div className="mt-2 text-xs text-muted-foreground">
          {footerLabel}: {footerValue}
        </div>
      ) : null}
    </div>
  );
};

export default MaintenanceTicketCard;
