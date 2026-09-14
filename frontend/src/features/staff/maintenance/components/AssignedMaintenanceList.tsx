import {
  AdminClearFiltersButton,
  AdminFilterLayout,
} from "@/features/admin/layout/components/AdminFilterLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAssignedMaintenanceSummary,
  useAssignedMaintenances,
} from "@/features/staff/maintenance/hooks/useStaffMaintenance";
import useDebounce from "@/lib/useDebounce";
import type {
  AssignedMaintenanceScope,
  MaintenancePriority,
  MaintenanceStatus,
} from "@/features/staff/maintenance/types/maintenance.type";
import {
  AlertTriangle,
  Search,
  SearchX,
  Wrench,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import MaintenanceTicketCard from "./MaintenanceTicketCard";

type AssignedMaintenanceListProps = {
  scope: AssignedMaintenanceScope;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
};

const AssignedMaintenanceList = ({
  scope,
  title,
  description,
  emptyTitle,
  emptyDescription,
}: AssignedMaintenanceListProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<MaintenanceStatus | "all">("all");
  const [priority, setPriority] = useState<MaintenancePriority | "all">("all");
  const search = useDebounce(searchInput, 350);
  const filters = {
    search,
    status: status === "all" ? undefined : status,
    priority: priority === "all" ? undefined : priority,
  };
  const query = useAssignedMaintenances(scope, filters);
  const summaryQuery = useAssignedMaintenanceSummary(
    filters,
    scope === "active",
  );

  const tickets = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );
  const summary = summaryQuery.data;
  const statusOptions =
    scope === "active"
      ? (["Pending", "InProgress"] as const)
      : (["Completed", "Closed"] as const);
  const visibleStatuses = status === "all" ? statusOptions : [status];

  const hasFilters =
    Boolean(searchInput.trim()) || status !== "all" || priority !== "all";
  const detailScope = scope === "active" ? "assigned" : "history";
  const clearFilters = () => {
    setSearchInput("");
    setStatus("all");
    setPriority("all");
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-base leading-6 text-muted-foreground">
          {description}
        </p>
      </header>

      <div className="space-y-3">
        <label className="relative block lg:hidden">
          <span className="sr-only">Search maintenance tickets</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search ticket or title"
            className="h-11 bg-background pl-9"
          />
        </label>
        <div className="hidden lg:block">
          <AdminFilterLayout
            search={
              <label className="relative block">
                <span className="sr-only">Search maintenance tickets</span>
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search ticket or title"
                  className="bg-background pl-9"
                />
              </label>
            }
          >
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as MaintenanceStatus | "all")
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {getStatusLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={priority}
              onValueChange={(value) =>
                setPriority(value as MaintenancePriority | "all")
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="High">High priority</SelectItem>
                <SelectItem value="Medium">Medium priority</SelectItem>
                <SelectItem value="Low">Low priority</SelectItem>
              </SelectContent>
            </Select>
            <AdminClearFiltersButton
              disabled={!hasFilters}
              onClick={clearFilters}
            />
          </AdminFilterLayout>
        </div>

        {scope === "active" ? (
          <div className="flex flex-wrap gap-2 pb-1">
            <SummaryChip
              label={`Pending ${summary?.pending ?? 0}`}
              tone="pending"
            />
            <SummaryChip
              label={`In Progress ${summary?.inProgress ?? 0}`}
              tone="inProgress"
            />
            <SummaryChip
              label={`High Priority ${summary?.highPriority ?? 0}`}
              tone="high"
            />
          </div>
        ) : null}
      </div>

      {query.isLoading ? (
        <div
          className="grid grid-cols-1 gap-3 lg:grid-cols-3 2xl:grid-cols-4"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Loading maintenance tickets</span>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <TicketCardSkeleton key={item} />
          ))}
        </div>
      ) : query.isError ? (
        <ListState
          icon={<AlertTriangle className="size-5 text-destructive" />}
          title="Could not load maintenance"
          description="Check your connection and try again."
          actionLabel="Retry"
          onAction={() => query.refetch()}
        />
      ) : tickets.length === 0 ? (
        hasFilters ? (
          <ListState
            icon={<SearchX className="size-5 text-muted-foreground" />}
            title="No tickets found"
            description="Try a different ticket ID or title."
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        ) : (
          <ListState
            icon={<Wrench className="size-5 text-muted-foreground" />}
            title={emptyTitle}
            description={emptyDescription}
          />
        )
      ) : (
        <div className="space-y-7">
          {visibleStatuses.map((groupStatus) => {
            const groupTickets = tickets.filter(
              (ticket) => ticket.status === groupStatus,
            );
            if (!groupTickets.length) return null;
            return (
              <section
                key={groupStatus}
                className="space-y-3"
                aria-labelledby={`maintenance-${groupStatus}-heading`}
              >
                <div className="flex items-center gap-2">
                  <h2
                    id={`maintenance-${groupStatus}-heading`}
                    className="text-lg font-bold text-foreground"
                  >
                    {getStatusLabel(groupStatus)}
                  </h2>
                  <span className="text-sm font-medium text-muted-foreground">
                    {groupTickets.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 2xl:grid-cols-4">
                  {groupTickets.map((ticket) => (
                    <MaintenanceTicketCard
                      key={ticket.id}
                      ticket={ticket}
                      variant="board"
                      detailPath={`/staff/maintenance/${detailScope}/${ticket.id}`}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {query.hasNextPage ? (
        <div className="flex justify-center pt-1">
          <Button
            type="button"
            variant="outline"
            disabled={query.isFetchingNextPage}
            onClick={() => query.fetchNextPage()}
          >
            {query.isFetchingNextPage ? "Loading tickets..." : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

const SummaryChip = ({
  label,
  tone,
}: {
  label: string;
  tone: "pending" | "inProgress" | "high";
}) => {
  const toneClassName = {
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    inProgress: "border-blue-100 bg-blue-50 text-blue-700",
    high: "border-red-200 bg-red-50 text-red-700",
  }[tone];
  return (
    <span
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${toneClassName}`}
    >
      {label}
    </span>
  );
};

const getStatusLabel = (status: MaintenanceStatus) =>
  status === "InProgress" ? "In progress" : status;

const TicketCardSkeleton = () => (
  <div className="relative overflow-hidden rounded-xl border bg-card p-4 pl-5 shadow-sm">
    <span className="absolute inset-y-0 left-0 w-1 bg-primary" />
    <div className="space-y-3 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-5 w-48 rounded bg-muted" />
        </div>
        <div className="h-7 w-16 rounded-full bg-muted" />
      </div>
      <div className="space-y-2">
        <div className="h-4 rounded bg-muted/75" />
        <div className="h-4 w-4/5 rounded bg-muted/75" />
      </div>
      <div className="h-px bg-border" />
      <div className="flex justify-between gap-3">
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="h-7 w-36 rounded-full bg-muted" />
      </div>
    </div>
  </div>
);

const ListState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <section className="rounded-xl border border-dashed bg-card p-6 text-center">
    <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted">
      {icon}
    </div>
    <h2 className="mt-3 font-semibold text-foreground">{title}</h2>
    <p className="mx-auto mt-1 max-w-sm text-sm leading-5 text-muted-foreground">
      {description}
    </p>
    {actionLabel && onAction ? (
      <Button
        type="button"
        variant="outline"
        className="mt-4"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    ) : null}
  </section>
);

export default AssignedMaintenanceList;
