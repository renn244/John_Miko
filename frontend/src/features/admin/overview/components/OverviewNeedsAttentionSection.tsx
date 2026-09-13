import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetFeedbackOverviewQuery } from "@/features/admin/feedback/hooks/useAdminFeedback";
import { useGetMaintenanceOverviewQuery } from "@/features/admin/maintenance/hooks/useAdminMaintenance";
import { useGetPaymentOverviewQuery } from "@/features/admin/payments/hooks/useAdminPayments";
import { useGetStaffReportOverviewQuery } from "@/features/admin/staff-reports/hooks/useStaffReports";
import { formatPeso } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import {
    type AttentionItem,
    EmptyState,
    SectionHeader,
    attentionToneClassName,
    formatBadgeLabel,
    surfaceClassName,
} from "./Overview.shared";

const OverviewAttentionRow = ({ item }: { item: AttentionItem }) => {
    const tone = attentionToneClassName[item.kind];

    return (
        <Link
            to={item.to}
            className="group relative block min-h-[88px] py-3 pl-4 pr-1 transition-colors last:pb-0 hover:bg-muted/20"
        >
            <span
                className={cn(
                    "absolute bottom-2 left-0 top-2 w-1 rounded-full",
                    tone.accent,
                )}
            />
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                        {item.title}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {item.context}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {item.meta}
                    </p>
                </div>
                <div className="flex shrink-0 items-start gap-2">
                    <span
                        className={cn(
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                            tone.badge,
                        )}
                    >
                        {item.badgeLabel}
                    </span>
                    <ArrowRight className="mt-1 size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
            </div>
        </Link>
    );
};

const OverviewNeedsAttentionSection = ({
    selectedDate,
}: {
    selectedDate: string;
}) => {
    const paymentOverview = useGetPaymentOverviewQuery(selectedDate);
    const maintenanceOverview = useGetMaintenanceOverviewQuery(selectedDate);
    const staffReportOverview = useGetStaffReportOverviewQuery(selectedDate);
    const feedbackOverview = useGetFeedbackOverviewQuery(selectedDate);

    const items: AttentionItem[] = [
        ...(paymentOverview.data?.pendingPayments.map((payment) => ({
            id: `payment-${payment.id}`,
            kind: "payment" as const,
            title: payment.booking.guestName,
            context: `Payment - ${payment.booking.accommodation.name}`,
            meta: `${formatPeso(payment.amountPaid)} paid`,
            badgeLabel: "Pending",
            to: `/admin/booking/${payment.booking.id}`,
        })) ?? []),
        ...(maintenanceOverview.data?.highPriorityTickets.map((ticket) => ({
            id: `maintenance-${ticket.id}`,
            kind: "maintenance" as const,
            title: ticket.title,
            context: `Maintenance - ${ticket.expertise}`,
            meta: ticket.assignedTo?.name || "Unassigned",
            badgeLabel: formatBadgeLabel(ticket.priority),
            to: `/admin/maintenance/${ticket.id}`,
        })) ?? []),
        ...(staffReportOverview.data?.pendingReports.map((report) => ({
            id: `report-${report.id}`,
            kind: "report" as const,
            title: report.title,
            context: `Staff Report - ${report.booking?.referenceCode || report.type}`,
            meta: report.user.name || report.user.email,
            badgeLabel: formatBadgeLabel(report.severity),
            to: `/admin/maintenance/reports/${report.id}`,
        })) ?? []),
        ...(feedbackOverview.data?.lowRatingFeedback.map((feedback) => ({
            id: `feedback-${feedback.id}`,
            kind: "feedback" as const,
            title: feedback.user.name,
            context: `Feedback - ${feedback.comment || "No comment provided."}`,
            meta: `${feedback.rating}/5 rating`,
            badgeLabel: `${feedback.rating}/5`,
            to: "/admin/feedback",
        })) ?? []),
    ].slice(0, 8);

    const isLoading =
        paymentOverview.isLoading ||
        maintenanceOverview.isLoading ||
        staffReportOverview.isLoading ||
        feedbackOverview.isLoading;

    return (
        <div className={cn(surfaceClassName, "p-4")}>
            <div className="mb-4 flex items-center gap-2">
                <SectionHeader title="Needs Attention" />
            </div>

            {isLoading ? (
                <LoadingSpinner
                    className="size-5"
                    containerClassName="justify-start"
                />
            ) : items.length ? (
                <div className="divide-y divide-border/70">
                    {items.map((item) => (
                        <OverviewAttentionRow key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <EmptyState message="No urgent items need attention." />
            )}
        </div>
    );
};

export default OverviewNeedsAttentionSection;
