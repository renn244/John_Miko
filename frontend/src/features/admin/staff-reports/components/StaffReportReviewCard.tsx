import { getStaffReportStatusClasses } from "@/features/admin/staff-reports/components/staffReportDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useReviewStaffReportMutation } from "@/features/admin/staff-reports/hooks/useStaffReports";
import type { MaintenanceExpertise } from "@/features/admin/staff-management/types/staff-management.type";
import type { StaffReport } from "@/features/admin/staff-reports/types/staff-report.type";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

type StaffReportReviewCardProps = {
    report: StaffReport;
};

const StaffReportReviewCard = ({ report }: StaffReportReviewCardProps) => {
    const reviewMutation = useReviewStaffReportMutation(report.id);
    const [rejectionNote, setRejectionNote] = useState("");
    const [expertise, setExpertise] = useState<MaintenanceExpertise | undefined>();
    const isPending = report.status === "Pending";

    return (
        <Card className="gap-0 rounded-xl border border-primary/30 bg-card p-5 shadow-sm">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-foreground md:text-lg">Admin Review</h2>
            </div>

            {isPending ? (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Review this report and choose whether to approve or reject it.
                    </p>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Maintenance expertise</p>
                        <Select value={expertise} onValueChange={(value) => setExpertise(value as MaintenanceExpertise)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select expertise for routing" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Maintenance Expertise</SelectLabel>
                                    <SelectItem value="Electrical">Electrical</SelectItem>
                                    <SelectItem value="Pool">Pool</SelectItem>
                                    <SelectItem value="Construction">Construction</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={reviewMutation.isPending || !expertise}
                        onClick={() => reviewMutation.mutate({ status: "Approved", expertise })}
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve Report
                    </Button>

                    <div className="space-y-3 rounded-xl border border-red-200 p-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Reject Report</p>
                            <p className="text-sm text-muted-foreground">
                                Provide a short reason so the staff member has documentation.
                            </p>
                        </div>

                        <Textarea
                            rows={4}
                            value={rejectionNote}
                            onChange={(event) => setRejectionNote(event.target.value)}
                            placeholder="Explain the reason for rejection..."
                        />

                        <Button
                            variant="destructive"
                            className="w-full"
                            disabled={!rejectionNote.trim() || reviewMutation.isPending}
                            onClick={() =>
                                reviewMutation.mutate({
                                    status: "Rejected",
                                    rejectionNote: rejectionNote.trim(),
                                })
                            }
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Submit Rejection
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <Badge className={getStaffReportStatusClasses(report.status)}>
                        {report.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                        This report has already been reviewed and is now read-only.
                    </p>

                    {report.rejectionNote && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                            <p className="mb-1 text-sm font-semibold text-red-700">
                                Rejection Note
                            </p>
                            <p className="text-sm text-red-700">{report.rejectionNote}</p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default StaffReportReviewCard;
