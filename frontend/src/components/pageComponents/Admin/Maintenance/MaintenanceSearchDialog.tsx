import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import {
  formatMaintenanceShortDate,
  getMaintenanceAssigneeLabel,
  getMaintenancePriorityClasses,
  getMaintenanceStatusClasses,
  getMaintenanceStatusDate,
  getMaintenanceStatusLabel,
  sortMaintenanceByRelevantDate,
} from "@/components/pageComponents/Admin/Maintenance/maintenanceDisplay";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetMaintenancesQuery } from "@/hooks/admin/maintenance.hook";
import { cn } from "@/lib/utils";
import { useMaintenanceStore } from "@/store/admin/maintenance.store";
import type { Maintenance } from "@/types/admin/maintenance.type";
import { History, Search, Wrench } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { useNavigate } from "react-router";

const matchesTicket = (ticket: Maintenance, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [ticket.id, ticket.title, ticket.description]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalizedQuery));
};

const MaintenanceSearchDialog = () => {
  const isSearchOpen = useMaintenanceStore((state) => state.isSearchOpen);
  const setIsSearchOpen = useMaintenanceStore((state) => state.setIsSearchOpen);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, error, refetch, isRefetching } = useGetMaintenancesQuery({
    page: 1,
    limit: 100,
  });

  const filteredTickets = useMemo(() => {
    const tickets = data?.data ?? [];
    return sortMaintenanceByRelevantDate(
      tickets.filter((ticket) => matchesTicket(ticket, deferredSearch)),
    );
  }, [data?.data, deferredSearch]);

  const activeTickets = filteredTickets.filter((ticket) => ticket.status !== "Closed");
  const historyTickets = filteredTickets.filter((ticket) => ticket.status === "Closed");

  const handleSelectTicket = (ticketId: string) => {
    setIsSearchOpen(false);
    navigate(`/admin/maintenance/${ticketId}`);
  };

  return (
    <Dialog
      open={isSearchOpen}
      onOpenChange={(open) => {
        setIsSearchOpen(open);
        if (!open) {
          setSearch("");
        }
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-hidden p-0 sm:max-w-3xl gap-0" showCloseButton={false}>
        <DialogHeader className="gap-0 border-b px-6 py-5">
          <DialogTitle className="text-xl">Find Ticket</DialogTitle>

          <div className="relative mt-2">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by ticket ID, title, or description..."
              className="pl-9"
            />
          </div>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="flex h-56 items-center justify-center">
              <LoadingSpinner className="size-10" />
            </div>
          ) : null}

          {error ? (
            <ErrorDialog onBack={() => setIsSearchOpen(false)} onRetry={refetch} retryLoading={isRefetching} />
          ) : null}

          {!isLoading && !error ? (
            <div className="space-y-5">
              {activeTickets.length > 0 ? (
                <SearchSection
                  title="Active Tickets"
                  tickets={activeTickets}
                  onSelectTicket={handleSelectTicket}
                  variant="active"
                />
              ) : null}

              {historyTickets.length > 0 ? (
                <SearchSection
                  title="History"
                  tickets={historyTickets}
                  onSelectTicket={handleSelectTicket}
                  variant="history"
                />
              ) : null}

              {activeTickets.length === 0 && historyTickets.length === 0 && deferredSearch.trim() ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No tickets matched your search.
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SearchSection = ({
  title,
  tickets,
  onSelectTicket,
  variant,
}: {
  title: string;
  tickets: Maintenance[];
  onSelectTicket: (ticketId: string) => void;
  variant: "active" | "history";
}) => {
  const isHistory = variant === "history";

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {isHistory ? (
          <History className="size-4 text-muted-foreground" />
        ) : (
          <span className="size-2 rounded-full bg-primary" />
        )}
        <span>{title}</span>
        <span className="text-xs font-medium text-muted-foreground">{tickets.length}</span>
      </div>

      <div className="space-y-2">
        {tickets.map((ticket) => {
          const relevantDate = formatMaintenanceShortDate(
            getMaintenanceStatusDate(ticket, ticket.status),
          );

          return (
            <button
              key={ticket.id}
              type="button"
              onClick={() => onSelectTicket(ticket.id)}
              className={cn(
                "group w-full rounded-lg border bg-card px-3.5 py-3 text-left shadow-sm transition hover:border-primary/30 hover:bg-accent/15",
                isHistory && "hover:bg-accent/10",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mt-2 flex items-start gap-3">
                    {ticket.imagesUrl?.[0] ? (
                      <img
                        src={ticket.imagesUrl[0]}
                        alt={ticket.title}
                        className={cn(
                          "mt-0.5 h-14 w-14 rounded-lg border object-cover",
                          isHistory && "opacity-80 grayscale-[0.2]",
                        )}
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-muted/60 text-muted-foreground">
                        <Wrench className="size-5" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "truncate text-[15px] font-semibold leading-5 transition-colors group-hover:text-foreground",
                          isHistory ? "text-foreground/80" : "text-foreground",
                        )}
                      >
                        {ticket.title}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                        {ticket.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={cn(
                              "font-medium",
                              isHistory ? "text-foreground/70" : "text-foreground/80",
                            )}
                          >
                            {ticket.id}
                          </span>
                          <span>&bull;</span>
                          <span>Assigned to {getMaintenanceAssigneeLabel(ticket)}</span>
                        </div>
                        {relevantDate ? <span>{relevantDate}</span> : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Badge className="border px-2 py-0.5 text-[11px]">
                    {ticket.expertise}
                  </Badge>
                  <Badge className={cn("border px-2 py-0.5 text-[11px]", getMaintenancePriorityClasses(ticket.priority))}>
                    {ticket.priority}
                  </Badge>
                  <Badge className={cn("border px-2 py-0.5 text-[11px]", getMaintenanceStatusClasses(ticket.status))}>
                    {getMaintenanceStatusLabel(ticket.status)}
                  </Badge>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MaintenanceSearchDialog;
