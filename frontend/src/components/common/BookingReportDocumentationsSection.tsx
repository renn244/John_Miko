import BookingReportViewDialog from "@/components/common/BookingReportViewDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BookingReportDocumentation } from "@/types/booking.types";
import { CalendarDays, Eye, FileText, User2 } from "lucide-react";
import { useMemo, useState } from "react";

type BookingReportDocumentationsSectionProps = {
    reports?: BookingReportDocumentation[];
    compact?: boolean;
};

const BookingReportDocumentationsSection = ({
    reports = [],
    compact = false,
}: BookingReportDocumentationsSectionProps) => {
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

    const selectedReport = useMemo(
        () => reports.find((report) => report.id === selectedReportId) ?? null,
        [reports, selectedReportId],
    );

    return (
        <>
            <Card className={cn(
                "gap-0 shadow-none",
                compact ? "border-0 bg-transparent p-0" : "border-2 p-5"
            )}>
                <div className={cn("flex items-center justify-between gap-3", compact ? "mb-3" : "mb-4")}>
                    <div className="flex items-center gap-2">
                        {compact ? null : <FileText className="size-5 text-primary" />}
                        <h2
                            className={cn(
                                compact
                                    ? "text-base font-semibold text-foreground md:text-lg"
                                    : "text-xl font-bold",
                            )}
                        >
                            Report Documentations
                        </h2>
                    </div>

                    <Badge variant="outline">
                        {reports.length} report{reports.length === 1 ? "" : "s"}
                    </Badge>
                </div>

                {reports.length === 0 ? (
                    <div className={cn(
                        "border border-dashed bg-muted/25 text-sm text-muted-foreground",
                        compact ? "rounded-lg px-4 py-3" : "rounded-2xl p-6"
                    )}>
                        No check-in or check-out reports for this booking.
                    </div>
                ) : (
                    <div className={cn(compact ? "space-y-2" : "space-y-4")}>
                        {reports.map((report) => {
                            const previewImage = report.proofImages[0];

                            return (
                                <div
                                    key={report.id}
                                    className={cn(
                                        "flex flex-col bg-white md:flex-row md:items-start",
                                        compact
                                            ? "gap-3 rounded-lg border border-border/70 p-3"
                                            : "gap-4 rounded-2xl border p-4"
                                    )}
                                >
                                    <div className={cn(
                                        "w-full overflow-hidden bg-muted md:shrink-0",
                                        compact ? "h-20 rounded-md md:w-24" : "h-24 rounded-2xl md:w-28"
                                    )}>
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt={report.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>

                                    <div className={cn("min-w-0 flex-1", compact ? "space-y-2" : "space-y-3")}>
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap gap-2">
                                                    <ReportTypeBadge type={report.type} />
                                                    <ReportStatusBadge status={report.status} />
                                                    <ReportSeverityBadge severity={report.severity} />
                                                </div>

                                                <div>
                                                    <p className="font-semibold">{report.title}</p>
                                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                                        {report.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size={compact ? "sm" : "default"}
                                                className="gap-2"
                                                onClick={() => setSelectedReportId(report.id)}
                                            >
                                                <Eye className="size-4" />
                                                View Report
                                            </Button>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <User2 className="h-4 w-4" />
                                                <span>{report.user.name || report.user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4" />
                                                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            <BookingReportViewDialog
                open={!!selectedReport}
                onOpenChange={(open) => {
                    if (!open) setSelectedReportId(null);
                }}
                report={selectedReport}
            />
        </>
    );
};

const ReportTypeBadge = ({ type }: { type: BookingReportDocumentation["type"] }) => {
    if (type === "checkOut") {
        return <Badge className="bg-violet-100 text-violet-700 border-violet-200">Check-Out</Badge>;
    }

    return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Check-In</Badge>;
};

const ReportStatusBadge = ({ status }: { status: BookingReportDocumentation["status"] }) => {
    if (status === "Approved") {
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Approved</Badge>;
    }

    if (status === "Rejected") {
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
    }

    return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>;
};

const ReportSeverityBadge = ({ severity }: { severity: BookingReportDocumentation["severity"] }) => {
    if (severity === "High") {
        return <Badge className="bg-red-100 text-red-700 border-red-200">High</Badge>;
    }

    if (severity === "Medium") {
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Medium</Badge>;
    }

    return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Low</Badge>;
};

export default BookingReportDocumentationsSection;
