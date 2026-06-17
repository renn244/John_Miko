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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetMaintenancesQuery } from "@/hooks/admin/maintenance.hook";
import { cn } from "@/lib/utils";
import { useMaintenanceStore } from "@/store/admin/maintenance.store";
import type { Maintenance } from "@/types/admin/maintenance.type";
import { Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

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
  const setViewId = useMaintenanceStore((state) => state.setViewId);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, error, refetch, isRefetching } = useGetMaintenancesQuery({
    page: 1,
    limit: 100,
  });

  const filteredTickets = useMemo(() => {
    const tickets = data?.data ?? [];
    return sortMaintenanceByRelevantDate(
      tickets.filter((ticket) => matchesTicket(ticket, deferredSearch))
    );
  }, [data?.data, deferredSearch]);

  const activeTickets = filteredTickets.filter((ticket) => ticket.status !== "Closed");

  const historyTickets = filteredTickets.filter((ticket) => ticket.status === "Closed");

  const handleSelectTicket = (ticketId: string) => {
    setIsSearchOpen(false);
    setViewId(ticketId);
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
      <DialogContent className="max-h-[85vh] overflow-hidden p-0 sm:max-w-3xl" showCloseButton={false}>
        <DialogHeader className="border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl">Find Ticket</DialogTitle>
              <DialogDescription className="mt-1">
                Search active maintenance work and browse closed history without using a table.
              </DialogDescription>
            </div>
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by ticket ID, title, or description..."
              className="h-11 rounded-xl pl-9"
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
            <div className="space-y-6">
              {activeTickets.length > 0 ? (
                <SearchSection
                  title="Active Tickets"
                  tickets={activeTickets}
                  onSelectTicket={handleSelectTicket}
                />
              ) : null}

              {historyTickets.length > 0 ? (
                <SearchSection
                  title="History"
                  tickets={historyTickets}
                  onSelectTicket={handleSelectTicket}
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
}: {
  title: string;
  tickets: Maintenance[];
  onSelectTicket: (ticketId: string) => void;
}) => {
  return (
    <section className="space-y-3">
      <div className="text-sm font-semibold text-foreground">
        {title}
      </div>

      <div className="space-y-2">
        {tickets.map((ticket) => {
          const relevantDate = formatMaintenanceShortDate(
            getMaintenanceStatusDate(ticket, ticket.status)
          );

          return (
            <button
              key={ticket.id}
              type="button"
              onClick={() => onSelectTicket(ticket.id)}
              className={cn(
                "w-full rounded-2xl border bg-background px-4 py-3 text-left shadow-xs transition hover:border-primary/30 hover:bg-accent/30"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">{ticket.id}</span>
                    {relevantDate ? <span>{relevantDate}</span> : null}
                    <span>•</span>
                    <span>{ticket.expertise}</span>
                  </div>
                  <div className="mt-1 flex items-start gap-3">
                    {ticket.imagesUrl?.[0] ? (
                      <img
                        src={ticket.imagesUrl[0]}
                        alt={ticket.title}
                        className="mt-0.5 h-12 w-12 rounded-lg object-cover"
                      />
                    ) : null}

                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground sm:text-base">
                        {ticket.title}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {ticket.description}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Assigned to {getMaintenanceAssigneeLabel(ticket)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge className={getMaintenancePriorityClasses(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Badge className={getMaintenanceStatusClasses(ticket.status)}>
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
