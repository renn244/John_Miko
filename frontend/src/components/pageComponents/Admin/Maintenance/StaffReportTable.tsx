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

            <div className="flex min-h-0 flex-1 flex-col overflow-x-auto">
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
            </div>
        </Card>
    )
}

export default StaffReportTable
