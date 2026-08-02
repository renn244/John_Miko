import AdminTableEmptyState from "@/components/common/AdminTableEmptyState";
import DataPagination from "@/components/common/DataPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetStaffReportsQuery } from "@/hooks/admin/staff-report.hook";
import { useStaffReportSearch } from "@/hooks/admin/staff-report.search";
import type { ReportSeverity, ReportStatus, ReportType } from "@/types/admin/staff-report.type";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import StaffReportFilter from "./StaffReportFilter";
import { formatStaffReportType, getStaffReportSeverityClasses, getStaffReportStatusClasses, getStaffReportTypeClasses } from "./staffReportDisplay";

const StaffReportTable = () => {
    const { search, status, type, severity, page, limit, updatePage } = useStaffReportSearch();
    const { data, isLoading } = useGetStaffReportsQuery({
        search,
        status: status as ReportStatus | undefined,
        type: type as ReportType | undefined,
        severity: severity as ReportSeverity | undefined,
        page,
        limit,
    });

    const reports = data?.data ?? [];
    const meta = data?.meta;
    const hasActiveFilters = Boolean(search || status || type || severity);

    return (
        <Card className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden py-0">
            <div className="border-b px-4 py-4">
                <StaffReportFilter />
            </div>

            <div className="space-y-3 p-3 md:hidden">
                {!isLoading && reports.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        {hasActiveFilters ? "No staff reports found for the current filters." : "No staff reports yet."}
                    </p>
                ) : reports.map((report) => (
                    <article key={report.id} className="rounded-xl border bg-card p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate font-semibold tracking-tight">{report.title}</p>
                                <p className="mt-1 truncate text-xs text-muted-foreground">{report.id}</p>
                            </div>
                            <Badge className={getStaffReportStatusClasses(report.status)}>
                                {report.status}
                            </Badge>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStaffReportTypeClasses(report.type)}>
                                {formatStaffReportType(report.type)}
                            </Badge>
                            <Badge className={getStaffReportSeverityClasses(report.severity)}>
                                {report.severity}
                            </Badge>
                        </div>

                        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y py-3 text-sm">
                            <div className="min-w-0">
                                <dt className="text-xs text-muted-foreground">Reporter</dt>
                                <dd className="mt-1 truncate font-medium">{report.user.name || report.user.email}</dd>
                                <dd className="truncate text-xs text-muted-foreground">{report.user.role}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">Submitted</dt>
                                <dd className="mt-1 font-medium">{format(new Date(report.createdAt), "MMM dd, yyyy")}</dd>
                            </div>
                            <div className="col-span-2 min-w-0">
                                <dt className="text-xs text-muted-foreground">Linked booking</dt>
                                <dd className="mt-1 truncate font-medium text-primary">
                                    {report.booking ? `${report.booking.referenceCode ?? "—"} · ${report.booking.guestName}` : "No linked booking"}
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-3">
                            <Button asChild variant="outline" size="sm">
                                <Link to={`/admin/maintenance/reports/${report.id}`}>
                                    Review report
                                    <ChevronRight className="size-4" />
                                </Link>
                            </Button>
                        </div>
                    </article>
                ))}
            </div>

            <div className="hidden min-h-0 flex-1 flex-col overflow-x-auto md:flex">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Report</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Reporter</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Type</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Severity</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Linked Booking</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Submitted</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Status</TableHead>
                            <TableHead className="px-4 py-3 text-right text-xs font-semibold tracking-[0.01em] text-muted-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoading && reports.length === 0 && (
                            <AdminTableEmptyState
                                colSpan={8}
                                emptyMessage="No staff reports yet."
                                filteredMessage="No staff reports found for the current filters."
                                hasActiveFilters={hasActiveFilters}
                                className="px-4 py-8 text-center text-sm text-muted-foreground"
                            />
                        )}

                        {reports.map((report) => (
                            <TableRow key={report.id} className="group hover:bg-primary/[0.03]">
                                <TableCell className="max-w-72 px-4 py-4">
                                    <div className="space-y-1">
                                        <p className="truncate font-medium">{report.title}</p>
                                        <p className="text-xs text-muted-foreground">{report.id}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-4">
                                    <div className="space-y-1">
                                        <p className="font-medium">{report.user.name || report.user.email}</p>
                                        <p className="text-xs text-muted-foreground">{report.user.role}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-4 align-top">
                                    <Badge className={getStaffReportTypeClasses(report.type)}>
                                        {formatStaffReportType(report.type)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-4 align-top">
                                    <Badge className={getStaffReportSeverityClasses(report.severity)}>
                                        {report.severity}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-4">
                                    {report.booking ? (
                                        <div className="space-y-1">
                                            <p className="font-medium text-primary">{report.booking.referenceCode ?? "—"}</p>
                                            <p className="text-xs text-muted-foreground">{report.booking.guestName}</p>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">No linked booking</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-4 py-4 align-top">
                                    {format(new Date(report.createdAt), "MMM dd, yyyy")}
                                </TableCell>
                                <TableCell className="px-4 py-4 align-top">
                                    <Badge className={getStaffReportStatusClasses(report.status)}>
                                        {report.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-4 text-right">
                                    <Button
                                        asChild
                                        variant="link"
                                        size="sm"
                                        className="h-auto px-0 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary"
                                        >
                                            <Link to={`/admin/maintenance/reports/${report.id}`}>
                                            Review
                                            <ChevronRight className="h-4 w-4" />
                                            </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>

            <div className="mt-auto border-t bg-background/80 px-4 py-4">
                <DataPagination
                    meta={meta}
                    fallbackMeta={{
                        total: reports.length,
                        limit,
                    }}
                    page={page}
                    onPageChange={updatePage}
                    showSinglePageControls
                />
            </div>
        </Card>
    )
}

export default StaffReportTable
