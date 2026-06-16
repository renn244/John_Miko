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

    return (
        <Card className="min-h-147.5 px-4">
            <div className="flex items-center justify-between border-b py-4">
                <div>
                    <p className="text-sm font-medium text-foreground">Staff Report Review Queue</p>
                    <p className="text-sm text-muted-foreground">
                        {isLoading ? "Loading reports..." : `Showing ${meta?.total ?? 0} report${(meta?.total ?? 0) === 1 ? "" : "s"}`}
                    </p>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Report</TableHead>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Linked Booking</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isLoading && reports.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                                No staff reports found for the current filters.
                            </TableCell>
                        </TableRow>
                    )}

                    {reports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell className="max-w-72">
                                <div className="space-y-1">
                                    <p className="truncate font-semibold">{report.title}</p>
                                    <p className="text-xs text-muted-foreground">{report.id}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <p className="font-medium">{report.user.name || report.user.email}</p>
                                    <p className="text-xs text-muted-foreground">{report.user.role}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge className={getStaffReportTypeClasses(report.type)}>
                                    {formatStaffReportType(report.type)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={getStaffReportSeverityClasses(report.severity)}>
                                    {report.severity}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {report.booking ? (
                                    <div className="space-y-1">
                                        <p className="font-medium text-primary">{report.booking.id}</p>
                                        <p className="text-xs text-muted-foreground">{report.booking.guestName}</p>
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground">No linked booking</span>
                                )}
                            </TableCell>
                            <TableCell>{format(new Date(report.createdAt), "MMM dd, yyyy")}</TableCell>
                            <TableCell>
                                <Badge className={getStaffReportStatusClasses(report.status)}>
                                    {report.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Link to={`/admin/maintenance/reports/${report.id}`}>
                                    <Button variant="ghost" className="gap-1 text-primary">
                                        Review
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {meta && (
                <DataPagination
                    meta={meta}
                    page={page}
                    onPageChange={updatePage}
                />
            )}
        </Card>
    )
}

export default StaffReportTable
