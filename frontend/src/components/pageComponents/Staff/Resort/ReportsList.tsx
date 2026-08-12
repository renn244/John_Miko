import { AdminClearFiltersButton } from "@/components/pageComponents/Admin/AdminFilterLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMyResortReports } from "@/hooks/staff/resort.hook";
import type {
  ReportSeverity,
  ReportStatus,
  ReportType,
  ResortReportsFilters,
  StaffReport,
} from "@/types/staff/resort.type";
import {
  AlertTriangle,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Filter,
  Plus,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import {
  formatResortDate,
  reportAccent,
  reportReference,
  reportSeverityClass,
  reportStatusClass,
  reportTypeLabels,
} from "./resortDisplay";
import { ResortListSkeleton } from "./ResortLoadingSkeleton";

const reportStatuses: ReportStatus[] = ["Pending", "Rejected", "Approved"];

const ReportsList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ResortReportsFilters>({});
  const [draft, setDraft] = useState<ResortReportsFilters>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const query = useMyResortReports(filters);
  const reports = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );
  const activeFilters = (
    Object.entries(filters) as [
      keyof ResortReportsFilters,
      string | undefined,
    ][]
  ).filter(([, value]) => Boolean(value));
  const sections = useMemo(
    () =>
      reportStatuses
        .map((status) => ({
          status,
          items: reports.filter((report) => report.status === status),
        }))
        .filter((section) => section.items.length),
    [reports],
  );
  const clearFilters = () => {
    setFilters({});
    setDraft({});
  };
  const openSheet = () => {
    setDraft(filters);
    setSheetOpen(true);
  };
  const clearFilter = (key: keyof ResortReportsFilters) =>
    setFilters((current) => ({ ...current, [key]: undefined }));

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My reports
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            Track reports submitted for admin review.
          </p>
        </div>
        <Button
          type="button"
          className="size-11 lg:h-9 lg:w-auto"
          onClick={() => navigate("/staff/resort/new-report")}
          aria-label="Create report"
        >
          <Plus data-icon="inline-start" />
          <span className="hidden lg:inline">New report</span>
        </Button>
      </header>

      <div className="lg:hidden">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={openSheet}
          >
            <Filter data-icon="inline-start" />
            Filter
            {activeFilters.length ? (
              <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                {activeFilters.length}
              </span>
            ) : null}
          </Button>
          {activeFilters.map(([key, value]) => (
            <button
              type="button"
              key={key}
              className="rounded-full border bg-card px-3 py-2 text-sm font-medium"
              onClick={() => clearFilter(key)}
            >
              {filterLabel(key, value)} ×
            </button>
          ))}
        </div>
      </div>

      <div className="hidden flex-wrap items-center gap-2 lg:flex lg:justify-end">
        <ReportStatusSelect
          value={filters.status ?? "all"}
          onChange={(value) =>
            setFilters((current) => ({
              ...current,
              status: value === "all" ? undefined : (value as ReportStatus),
            }))
          }
        />
        <ReportTypeSelect
          value={filters.type ?? "all"}
          onChange={(value) =>
            setFilters((current) => ({
              ...current,
              type: value === "all" ? undefined : (value as ReportType),
            }))
          }
        />
        <ReportSeveritySelect
          value={filters.severity ?? "all"}
          onChange={(value) =>
            setFilters((current) => ({
              ...current,
              severity: value === "all" ? undefined : (value as ReportSeverity),
            }))
          }
        />
        <AdminClearFiltersButton
          disabled={!activeFilters.length}
          onClick={clearFilters}
        />
      </div>

      {query.isLoading ? <ResortListSkeleton /> : null}

      {!query.isLoading && query.isError ? (
        <State
          icon={<AlertTriangle className="size-7 text-destructive" />}
          title="Could not load reports"
          description="Check your connection and try again."
          action="Retry"
          onAction={() => query.refetch()}
        />
      ) : null}

      {!query.isLoading && !query.isError && !reports.length ? (
        <State
          icon={<ClipboardList className="size-7 text-primary" />}
          title="No reports found"
          description={
            activeFilters.length
              ? "Try changing the selected filters to find what you need."
              : "Submit a report when something needs admin review."
          }
          action={activeFilters.length ? "Reset filters" : "Create report"}
          onAction={() =>
            activeFilters.length
              ? clearFilters()
              : navigate("/staff/resort/new-report")
          }
        />
      ) : null}

      {!query.isLoading && !query.isError && reports.length > 0
        ? sections.map((section) => (
            <section key={section.status} className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${reportAccent[section.status]}`}
                />
                <h2 className="text-lg font-bold text-foreground">
                  {section.status === "Pending"
                    ? "Waiting for review"
                    : section.status}
                </h2>
                <span className="text-sm font-medium text-muted-foreground">
                  {section.items.length}
                </span>
              </div>

              <div className="space-y-3 lg:hidden">
                {section.items.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
              <div className="hidden gap-3 lg:grid lg:grid-cols-3 2xl:grid-cols-4">
                {section.items.map((report) => (
                  <ReportCard key={report.id} report={report} variant="board" />
                ))}
              </div>
            </section>
          ))
        : null}

      {query.hasNextPage ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={query.isFetchingNextPage}
          onClick={() => query.fetchNextPage()}
        >
          {query.isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      ) : null}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto max-w-2xl rounded-t-2xl px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="px-0">
            <SheetTitle>Filter reports</SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            <FilterButtons
              label="Status"
              values={["Pending", "Approved", "Rejected"]}
              selected={draft.status}
              onSelect={(status) =>
                setDraft((current) => ({
                  ...current,
                  status:
                    current.status === status
                      ? undefined
                      : (status as ReportStatus),
                }))
              }
            />
            <FilterButtons
              label="Type"
              values={["checkIn", "checkOut", "maintenance"]}
              labels={reportTypeLabels}
              selected={draft.type}
              onSelect={(type) =>
                setDraft((current) => ({
                  ...current,
                  type:
                    current.type === type ? undefined : (type as ReportType),
                }))
              }
            />
            <FilterButtons
              label="Severity"
              values={["Low", "Medium", "High"]}
              selected={draft.severity}
              onSelect={(severity) =>
                setDraft((current) => ({
                  ...current,
                  severity:
                    current.severity === severity
                      ? undefined
                      : (severity as ReportSeverity),
                }))
              }
            />
          </div>
          <SheetFooter className="flex-row gap-3 border-t px-0 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                clearFilters();
                setSheetOpen(false);
              }}
            >
              Reset
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={() => {
                setFilters(draft);
                setSheetOpen(false);
              }}
            >
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const ReportStatusSelect = ({
  value,
  onChange,
}: {
  value: "all" | ReportStatus;
  onChange: (value: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-40">
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="all">All statuses</SelectItem>
        {reportStatuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status === "Pending" ? "Waiting for review" : status}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

const ReportTypeSelect = ({
  value,
  onChange,
}: {
  value: "all" | ReportType;
  onChange: (value: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-40">
      <SelectValue placeholder="Type" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="all">All types</SelectItem>
        {(Object.keys(reportTypeLabels) as ReportType[]).map((type) => (
          <SelectItem key={type} value={type}>
            {reportTypeLabels[type]}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

const ReportSeveritySelect = ({
  value,
  onChange,
}: {
  value: "all" | ReportSeverity;
  onChange: (value: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-40">
      <SelectValue placeholder="Severity" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="all">All severities</SelectItem>
        {(["Low", "Medium", "High"] as ReportSeverity[]).map((severity) => (
          <SelectItem key={severity} value={severity}>
            {severity} severity
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

const ReportCard = ({
  report,
  variant = "list",
}: {
  report: StaffReport;
  variant?: "list" | "board";
}) => (
  <Link
    to={`/staff/resort/report/${report.id}`}
    className={`group relative block overflow-hidden rounded-xl border bg-card shadow-sm transition-colors hover:bg-accent/35 ${variant === "board" ? "h-full lg:min-h-[190px]" : ""}`}
  >
    <span
      aria-hidden="true"
      className={`absolute inset-y-0 left-0 w-1 ${reportAccent[report.status]}`}
    />
    <div className="space-y-3 p-4 pl-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {reportReference(report.id)} · {reportTypeLabels[report.type]}
          </p>
          <h3 className="mt-1 line-clamp-2 text-lg font-bold text-foreground">
            {report.title}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${reportStatusClass[report.status]}`}
        >
          {report.status}
        </span>
      </div>
      <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
        {report.description}
      </p>
      <div className="flex items-center justify-between gap-3 border-t pt-3">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          {formatResortDate(report.createdAt, true)}
        </span>
        <span className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${reportSeverityClass[report.severity]}`}
          >
            {report.severity} severity
          </span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </span>
      </div>
    </div>
  </Link>
);

const FilterButtons = ({
  label,
  values,
  labels,
  selected,
  onSelect,
}: {
  label: string;
  values: string[];
  labels?: Record<string, string>;
  selected?: string;
  onSelect: (value: string) => void;
}) => (
  <div>
    <p className="mb-2 text-sm font-semibold">{label}</p>
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <button
          type="button"
          key={value}
          aria-pressed={selected === value}
          onClick={() => onSelect(value)}
          className={`rounded-full border px-3 py-2 text-sm font-semibold ${selected === value ? "border-primary bg-primary text-primary-foreground" : "bg-background"}`}
        >
          {labels?.[value] || value}
        </button>
      ))}
    </div>
  </div>
);

const State = ({
  icon,
  title,
  description,
  action,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
  onAction: () => void;
}) => (
  <section className="py-14 text-center">
    <div className="flex justify-center">{icon}</div>
    <h2 className="mt-3 font-bold">{title}</h2>
    <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
      {description}
    </p>
    <Button type="button" variant="outline" className="mt-4" onClick={onAction}>
      {action}
    </Button>
  </section>
);

const filterLabel = (
  key: keyof ResortReportsFilters,
  value: string | undefined,
) => {
  if (!value) return "";
  if (key === "type") return reportTypeLabels[value as ReportType];
  if (key === "severity") return `${value} severity`;
  return value;
};

export default ReportsList;
