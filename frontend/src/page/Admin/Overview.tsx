import RevenueBreakdownCard from "@/components/pageComponents/Admin/Revenue/RevenueBreakdownCard";
import RevenueLineChart, {
    type RevenueLineChartPoint,
} from "@/components/pageComponents/Admin/Revenue/RevenueLineChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import StatisticCards from "@/components/ui/StatisticCards";
import { useGetBookingOverviewQuery } from "@/hooks/admin/booking.hook";
import { useGetFeedbackOverviewQuery } from "@/hooks/admin/feedback.hook";
import { useGetMaintenanceOverviewQuery } from "@/hooks/admin/maintenance.hook";
import {
    useGetPaymentOverviewQuery,
    useGetRevenueAnalyticsQuery,
} from "@/hooks/admin/payment.hook";
import { useGetStaffReportOverviewQuery } from "@/hooks/admin/staff-report.hook";
import { formatToSmartDate, removeTimeFromDate } from "@/lib/date.util";
import { cn, formatPeso } from "@/lib/utils";
import type { RevenueAnalyticsApiItem } from "@/types/admin/payment.type";
import type { BookingOverviewSummary } from "@/types/booking.types";
import type { FeedbackOverviewItem } from "@/types/feedback.types";
import { format } from "date-fns";
import {
    ArrowRight,
    CalendarCheck,
    CheckCircle2,
    CreditCard,
    DollarSign,
    Star,
    Ticket,
    Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, type To } from "react-router";

const surfaceClassName =
    "rounded-xl border border-border/70 bg-card shadow-sm";

const statusToneClassName: Record<string, string> = {
    Pending: "border-amber-200 bg-amber-50 text-amber-700",
    Confirmed: "border-blue-200 bg-blue-50 text-blue-700",
    Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Rejected: "border-rose-200 bg-rose-50 text-rose-700",
    Cancelled: "border-rose-200 bg-rose-50 text-rose-700",
    InProgress: "border-blue-200 bg-blue-50 text-blue-700",
    Closed: "border-slate-200 bg-slate-50 text-slate-700",
    High: "border-rose-200 bg-rose-50 text-rose-700",
    Medium: "border-amber-200 bg-amber-50 text-amber-700",
    Low: "border-slate-200 bg-slate-50 text-slate-700",
};

const getBookingRowAccent = (status?: string | null) => {
    switch (status) {
        case "Pending":
            return "#F59E0B";
        case "Confirmed":
            return "#1E73BE";
        case "Completed":
            return "#059669";
        case "Cancelled":
            return "#DC2626";
        default:
            return "#D1D5DB";
    }
};

const getOverviewFeedbackTone = (rating: number) => {
    switch (true) {
        case rating >= 5:
            return {
                accentClassName: "bg-emerald-500",
                containerClassName: "border-border/70 bg-background hover:bg-muted/30",
                avatarClassName:
                    "border-emerald-200 bg-emerald-100 text-emerald-700",
                ratingClassName: "text-emerald-700",
                commentClassName: "text-foreground/85",
            };
        case rating >= 4:
            return {
                accentClassName: "bg-lime-500",
                containerClassName: "border-border/70 bg-background hover:bg-muted/30",
                avatarClassName: "border-lime-200 bg-lime-100 text-lime-700",
                ratingClassName: "text-lime-700",
                commentClassName: "text-foreground/85",
            };
        case rating >= 3:
            return {
                accentClassName: "bg-amber-500",
                containerClassName: "border-border/70 bg-background hover:bg-muted/30",
                avatarClassName:
                    "border-amber-200 bg-amber-100 text-amber-700",
                ratingClassName: "text-amber-700",
                commentClassName: "text-foreground/85",
            };
        default:
            return {
                accentClassName: "bg-rose-500",
                containerClassName: "border-border/70 bg-background hover:bg-muted/30",
                avatarClassName: "border-rose-200 bg-rose-100 text-rose-700",
                ratingClassName: "text-rose-700",
                commentClassName: "text-foreground/85",
            };
    }
};

const normalizeRevenueRow = (
    row: RevenueAnalyticsApiItem,
): RevenueLineChartPoint => ({
    month: row.month,
    count: Number(row.count) || 0,
    totalAmount: Number(row.totalamount) || 0,
    accommodationAmount: Number(row.accommodationamount) || 0,
    preOrderAmount: Number(row.preorderamount) || 0,
    addOnAmount: Number(row.addonamount) || 0,
    guestFeeAmount: Number(row.guestfeeamount) || 0,
    privateClosureRevenueAmount: Number(row.privateclosurerevenueamount) || 0,
});

const toMonthKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
};

const monthKeyToDate = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    return new Date(Number(year), Number(month) - 1, 1);
};

const addMonths = (date: Date, delta: number) =>
    new Date(date.getFullYear(), date.getMonth() + delta, 1);

const buildLastMonthsSeries = (
    rows: RevenueLineChartPoint[],
    months: number,
    endMonthKey: string,
): RevenueLineChartPoint[] => {
    const existingByMonth = new Map<string, RevenueLineChartPoint>();
    rows.forEach((row) => existingByMonth.set(row.month, row));

    const endDate = monthKeyToDate(endMonthKey);
    const series: RevenueLineChartPoint[] = [];

    for (let i = months - 1; i >= 0; i -= 1) {
        const key = toMonthKey(addMonths(endDate, -i));
        series.push(
            existingByMonth.get(key) ?? {
                month: key,
                count: 0,
                totalAmount: 0,
                accommodationAmount: 0,
                preOrderAmount: 0,
                addOnAmount: 0,
                guestFeeAmount: 0,
                privateClosureRevenueAmount: 0,
            },
        );
    }

    return series;
};

type SectionHeaderProps = {
    title: string;
    linkTo?: To;
    linkLabel?: string;
};

const SectionHeader = ({ title, linkTo, linkLabel }: SectionHeaderProps) => (
    <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {linkTo && linkLabel ? (
            <Link
                to={linkTo}
                className="text-xs font-semibold text-primary hover:underline"
            >
                {linkLabel}
            </Link>
        ) : null}
    </div>
);

const EmptyState = ({ message }: { message: string }) => (
    <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
        {message}
    </div>
);

const formatBadgeLabel = (value?: string | null) =>
    value ? value.replace(/([a-z])([A-Z])/g, "$1 $2") : "Unknown";

const StatusBadge = ({ value }: { value?: string | null }) => (
    <Badge
        variant="outline"
        className={cn(
            value
                ? statusToneClassName[value] ?? "border-border text-muted-foreground"
                : "border-border text-muted-foreground",
        )}
    >
        {formatBadgeLabel(value)}
    </Badge>
);

const formatDate = (value: string) => format(new Date(value), "MMM dd, yyyy");

const attentionToneClassName: Record<
    "payment" | "maintenance" | "report" | "feedback",
    {
        accent: string;
        badge: string;
    }
> = {
    payment: {
        accent: "bg-amber-500",
        badge: "border-amber-200 bg-amber-50 text-amber-700",
    },
    maintenance: {
        accent: "bg-rose-500",
        badge: "border-rose-200 bg-rose-50 text-rose-700",
    },
    report: {
        accent: "bg-blue-500",
        badge: "border-blue-200 bg-blue-50 text-blue-700",
    },
    feedback: {
        accent: "bg-orange-500",
        badge: "border-orange-200 bg-orange-50 text-orange-700",
    },
};

const Overview = () => {
    const todayInputValue = removeTimeFromDate(new Date());
    const selectedDate = todayInputValue;
    const [selectedRevenueMonth, setSelectedRevenueMonth] = useState<string | null>(
        () => toMonthKey(new Date()),
    );

    const bookingOverview = useGetBookingOverviewQuery(selectedDate);
    const paymentOverview = useGetPaymentOverviewQuery(selectedDate);
    const maintenanceOverview = useGetMaintenanceOverviewQuery(selectedDate);
    const staffReportOverview = useGetStaffReportOverviewQuery(selectedDate);
    const feedbackOverview = useGetFeedbackOverviewQuery(selectedDate);
    const revenueQuery = useGetRevenueAnalyticsQuery();

    const revenueData = useMemo(() => {
        if (revenueQuery.isError) return [];
        const rows = (revenueQuery.data ?? []).map(normalizeRevenueRow);
        return buildLastMonthsSeries(rows, 12, toMonthKey(new Date()));
    }, [revenueQuery.data, revenueQuery.isError]);

    useEffect(() => {
        if (!selectedRevenueMonth) return;
        if (revenueData.some((row) => row.month === selectedRevenueMonth)) return;
        setSelectedRevenueMonth(null);
    }, [revenueData, selectedRevenueMonth]);

    const selectedRevenue = useMemo(
        () => revenueData.find((row) => row.month === selectedRevenueMonth) ?? null,
        [revenueData, selectedRevenueMonth],
    );

    const attentionItems = useMemo(() => {
        const pendingPayments =
            paymentOverview.data?.pendingPayments.map((payment) => ({
                id: `payment-${payment.id}`,
                kind: "payment" as const,
                title: payment.booking.guestName,
                context: `Payment - ${payment.booking.accommodation.name}`,
                meta: `${formatPeso(payment.amountPaid)} paid`,
                badgeLabel: "Pending",
                to: `/admin/booking/${payment.booking.id}`,
            })) ?? [];

        const highPriorityMaintenance =
            maintenanceOverview.data?.highPriorityTickets.map((ticket) => ({
                id: `maintenance-${ticket.id}`,
                kind: "maintenance" as const,
                title: ticket.title,
                context: `Maintenance - ${ticket.expertise}`,
                meta: ticket.assignedTo?.name || "Unassigned",
                badgeLabel: formatBadgeLabel(ticket.priority),
                to: `/admin/maintenance/${ticket.id}`,
            })) ?? [];

        const pendingReports =
            staffReportOverview.data?.pendingReports.map((report) => ({
                id: `report-${report.id}`,
                kind: "report" as const,
                title: report.title,
                context: `Staff Report - ${report.booking?.referenceCode || report.type}`,
                meta: report.user.name || report.user.email,
                badgeLabel: formatBadgeLabel(report.severity),
                to: `/admin/maintenance/reports/${report.id}`,
            })) ?? [];

        const lowRatings =
            feedbackOverview.data?.lowRatingFeedback.map((feedback) => ({
                id: `feedback-${feedback.id}`,
                kind: "feedback" as const,
                title: feedback.user.name,
                context: `Feedback - ${feedback.comment || "No comment provided."}`,
                meta: `${feedback.rating}/5 rating`,
                badgeLabel: `${feedback.rating}/5`,
                to: "/admin/feedback",
            })) ?? [];

        return [
            ...pendingPayments,
            ...highPriorityMaintenance,
            ...pendingReports,
            ...lowRatings,
        ].slice(0, 8);
    }, [
        feedbackOverview.data,
        maintenanceOverview.data,
        paymentOverview.data,
        staffReportOverview.data,
    ]);

    const overviewDateLabel = format(
        new Date(`${selectedDate}T00:00:00`),
        "MMMM d, yyyy",
    );

    return (
        <div className="space-y-5">
            <header className="space-y-1">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        Overview
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Operational snapshot for {overviewDateLabel}.
                    </p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
                <StatisticCards
                    title="Today's Bookings"
                    stat={bookingOverview.data?.todayCount ?? 0}
                    Icon={<CalendarCheck />}
                    accentClassName="border-l-blue-500"
                    iconContainerClassName="bg-blue-500"
                    isLoading={bookingOverview.isLoading}
                />
                <StatisticCards
                    title="Pending Payments"
                    stat={paymentOverview.data?.pendingReviewCount ?? 0}
                    Icon={<CreditCard />}
                    accentClassName="border-l-amber-500"
                    iconContainerClassName="bg-amber-500"
                    isLoading={paymentOverview.isLoading}
                />
                <StatisticCards
                    title="Open Maintenance"
                    stat={maintenanceOverview.data?.openMaintenance ?? 0}
                    Icon={<Wrench />}
                    accentClassName="border-l-rose-500"
                    iconContainerClassName="bg-rose-500"
                    isLoading={maintenanceOverview.isLoading}
                />
                <StatisticCards
                    title="Today Revenue"
                    stat={paymentOverview.data?.todayRevenue ?? 0}
                    format={(value) => formatPeso(value)}
                    Icon={<DollarSign />}
                    accentClassName="border-l-emerald-500"
                    iconContainerClassName="bg-emerald-500"
                    isLoading={paymentOverview.isLoading}
                />
            </section>

            {revenueQuery.isError ? (
                <div className={cn(surfaceClassName, "p-4")}>
                    <EmptyState message="Failed to load revenue analytics." />
                </div>
            ) : null}

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <RevenueLineChart
                    data={revenueData}
                    isLoading={revenueQuery.isLoading}
                    selectedMonth={selectedRevenueMonth}
                    onSelectMonth={(month) => setSelectedRevenueMonth(month || null)}
                />
                <RevenueBreakdownCard selected={selectedRevenue} />
            </section>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className={cn(surfaceClassName, "overflow-hidden")}>
                    <div className="border-b border-border/70 p-4">
                        <SectionHeader
                            title="Today's Schedule"
                            linkTo={{
                                pathname: "/admin/booking",
                                search: `?bookingDate=${selectedDate}`,
                            }}
                            linkLabel="View bookings"
                        />
                    </div>
                    <BookingScheduleList
                        bookings={bookingOverview.data?.todaySchedule ?? []}
                        isLoading={bookingOverview.isLoading}
                    />
                </div>

                <div className={cn(surfaceClassName, "p-4")}>
                    <div className="mb-4 flex items-center gap-2">
                        <SectionHeader title="Needs Attention" />
                    </div>

                    {paymentOverview.isLoading ||
                    maintenanceOverview.isLoading ||
                    staffReportOverview.isLoading ||
                    feedbackOverview.isLoading ? (
                        <LoadingSpinner
                            className="size-5"
                            containerClassName="justify-start"
                        />
                    ) : attentionItems.length ? (
                        <div className="divide-y divide-border/70">
                            {attentionItems.map((item) => (
                                (() => {
                                    const tone = attentionToneClassName[item.kind];

                                    return (
                                <Link
                                    key={item.id}
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
                                })()
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="No urgent items need attention." />
                    )}
                </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-3">
                <MaintenancePressureCard
                    data={maintenanceOverview.data}
                    isLoading={maintenanceOverview.isLoading}
                />
                <RecentBookingsCard
                    bookings={bookingOverview.data?.recentBookings ?? []}
                    isLoading={bookingOverview.isLoading}
                />
                <RecentFeedbackCard
                    feedback={feedbackOverview.data?.recentFeedback ?? []}
                    averageRating={feedbackOverview.data?.averageRating ?? 0}
                    isLoading={feedbackOverview.isLoading}
                />
            </section>

        </div>
    );
};

const BookingScheduleList = ({
    bookings,
    isLoading,
}: {
    bookings: BookingOverviewSummary[];
    isLoading: boolean;
}) => {
    if (isLoading) {
        return (
            <div className="p-4">
                <LoadingSpinner
                    className="size-5"
                    containerClassName="justify-start"
                />
            </div>
        );
    }

    if (!bookings.length) {
        return (
            <div className="p-4">
                <EmptyState message="No active bookings scheduled for this date." />
            </div>
        );
    }

    return (
        <div className="divide-y divide-border/70">
            <div className="hidden grid-cols-[1.15fr_1.35fr_1.3fr_1fr_0.9fr_0.9fr_0.6fr] gap-4 bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
                <span>Reference</span>
                <span>Guest</span>
                <span>Accommodation</span>
                <span>Stay</span>
                <span>Payment</span>
                <span>Status</span>
                <span className="text-right">Action</span>
            </div>
            {bookings.map((booking) => (
                <div
                    key={booking.id}
                    className="grid gap-3 border-l-[3px] px-4 py-3 pl-[13px] text-sm transition-colors hover:bg-primary/[0.03] md:grid-cols-[1.15fr_1.35fr_1.3fr_1fr_0.9fr_0.9fr_0.6fr] md:items-center md:gap-4"
                    style={{ borderLeftColor: getBookingRowAccent(booking.status) }}
                >
                    <div>
                        <p className="font-medium text-foreground">
                            {booking.referenceCode || booking.id}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground md:hidden">
                            {formatDate(booking.bookingDate)}
                        </p>
                    </div>
                    <p className="min-w-0 truncate text-foreground">{booking.guestName}</p>
                    <div className="min-w-0">
                        <p className="truncate text-foreground">
                            {booking.accommodation.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {booking.accommodation.type}
                        </p>
                    </div>
                    <p className="text-muted-foreground">
                        {booking.stayOptionLabelSnapshot}
                    </p>
                    <StatusBadge value={booking.payment?.status} />
                    <StatusBadge value={booking.status} />
                    <Button
                        asChild
                        variant="link"
                        size="sm"
                        className="justify-start px-0 md:justify-end"
                    >
                        <Link to={`/admin/booking/${booking.id}`}>View</Link>
                    </Button>
                </div>
            ))}
        </div>
    );
};

const MaintenancePressureCard = ({
    data,
    isLoading,
}: {
    data:
        | {
              statusCounts: {
                  Pending: number;
                  InProgress: number;
                  Completed: number;
                  Closed: number;
              };
              openMaintenance: number;
              highPriorityOpen: number;
              today: { newTickets: number; resolvedTickets: number };
          }
        | undefined;
    isLoading: boolean;
}) => {
    const pendingCount = data?.statusCounts.Pending ?? 0;
    const inProgressCount = data?.statusCounts.InProgress ?? 0;
    const highPriorityCount = data?.highPriorityOpen ?? 0;
    const totalPressure = pendingCount + inProgressCount + highPriorityCount;

    const pressureSegments =
        totalPressure > 0
            ? [
                  {
                      label: "Pending",
                      value: pendingCount,
                      className: "bg-amber-400",
                      width: (pendingCount / totalPressure) * 100,
                  },
                  {
                      label: "In Progress",
                      value: inProgressCount,
                      className: "bg-blue-500",
                      width: (inProgressCount / totalPressure) * 100,
                  },
                  {
                      label: "High Priority",
                      value: highPriorityCount,
                      className: "bg-rose-500",
                      width: (highPriorityCount / totalPressure) * 100,
                  },
              ].filter((segment) => segment.value > 0)
            : [];

    return (
        <div className={cn(surfaceClassName, "p-4")}>
            <SectionHeader
                title="Maintenance Pressure"
                linkTo="/admin/maintenance"
                linkLabel="Open board"
            />
            {isLoading ? (
                <LoadingSpinner
                    className="mt-4 size-5"
                    containerClassName="justify-start"
                />
            ) : (
                <div className="mt-4 space-y-5">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Open Workload
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                                {data?.openMaintenance ?? 0} open
                            </p>
                        </div>

                        <div className="h-3.5 overflow-hidden rounded-[2px] bg-muted">
                            {pressureSegments.length ? (
                                <div className="flex h-full w-full">
                                    {pressureSegments.map((segment) => (
                                        <div
                                            key={segment.label}
                                            className={segment.className}
                                            style={{ width: `${segment.width}%` }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full w-full bg-muted" />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            {
                                label: "Pending",
                                value: pendingCount,
                                dotClassName: "bg-amber-400",
                            },
                            {
                                label: "In Progress",
                                value: inProgressCount,
                                dotClassName: "bg-blue-500",
                            },
                            {
                                label: "High Priority",
                                value: highPriorityCount,
                                dotClassName: "bg-rose-500",
                            },
                        ].map((item) => (
                            <div key={item.label} className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "size-2 rounded-full",
                                            item.dotClassName,
                                        )}
                                    />
                                    <span className="truncate text-xs text-muted-foreground">
                                        {item.label}
                                    </span>
                                </div>
                                <p className="text-lg font-semibold tracking-tight text-foreground">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border/70 pt-4">
                        <p className="text-xs text-muted-foreground">
                            Today
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 px-1 py-1">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600">
                                    <Ticket className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        New Tickets
                                    </p>
                                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                                        {data?.today.newTickets ?? 0}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-1 py-1">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
                                    <CheckCircle2 className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Resolved
                                    </p>
                                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                                        {data?.today.resolvedTickets ?? 0}
                                    </p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const RecentBookingsCard = ({
    bookings,
    isLoading,
}: {
    bookings: BookingOverviewSummary[];
    isLoading: boolean;
}) => (
    <div className={cn(surfaceClassName, "p-4")}>
        <SectionHeader title="Recent Bookings" linkTo="/admin/booking" linkLabel="View all" />
        <div className="mt-4">
            {isLoading ? (
                <LoadingSpinner className="size-5" containerClassName="justify-start"                                      />
            ) : bookings.length ? (
                <div className="divide-y divide-border/70">
                    {bookings.map((booking) => (
                        <Link
                            key={booking.id}
                            to={`/admin/booking/${booking.id}`}
                            className="group relative block min-h-[84px] py-3 pl-4 pr-1 transition-colors last:pb-0 hover:bg-muted/20"
                        >
                            <span
                                className="absolute bottom-2 left-0 top-2 w-1 rounded-full"
                                style={{ backgroundColor: getBookingRowAccent(booking.status) }}
                            />
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-foreground">
                                        {booking.guestName}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                        {booking.accommodation.name} - {formatDate(booking.bookingDate)}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {booking.referenceCode || booking.id}
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-start gap-2">
                                    <div className="flex flex-col gap-4 justify-between items-end">
                                        <span className="text-xs text-muted-foreground">
                                            {formatToSmartDate(booking.createdAt)}
                                        </span>
                                        <StatusBadge value={booking.status} />
                                    </div>
                                    <ArrowRight className="mt-0.5 size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <EmptyState message="No recent bookings found." />
            )}
        </div>
    </div>
);

const RecentFeedbackCard = ({
    feedback,
    averageRating,
    isLoading,
}: {
    feedback: FeedbackOverviewItem[];
    averageRating: number;
    isLoading: boolean;
}) => (
    <div className={cn(surfaceClassName, "p-4")}>
        <SectionHeader title="Recent Feedback" linkTo="/admin/feedback" linkLabel="View all" />
        <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-amber-600">
            <Star className="size-4 fill-current" />
            {averageRating.toFixed(1)} average
        </div>
        <div className="mt-4">
            {isLoading ? (
                <LoadingSpinner className="size-5" containerClassName="justify-start" />
            ) : feedback.length ? (
                <div className="space-y-2">
                    {feedback.map((item) => (
                        (() => {
                            const tone = getOverviewFeedbackTone(item.rating);

                            return (
                                <Link
                                    key={item.id}
                                    to="/admin/feedback"
                                    className={cn(
                                        "relative block overflow-hidden rounded-lg border px-3 py-3 pl-4 transition-colors hover:shadow-sm",
                                        tone.containerClassName,
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "absolute inset-y-0 left-0 w-1 rounded-l-lg",
                                            tone.accentClassName,
                                        )}
                                    />
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div
                                                className={cn(
                                                    "flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold bg-primary text-white"
                                                )}
                                            >
                                                {item.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-foreground">
                                                    {item.user.name}
                                                </p>
                                                <p
                                                    className={cn(
                                                        "mt-1 line-clamp-2 text-xs leading-5",
                                                        tone.commentClassName,
                                                    )}
                                                >
                                                    {item.comment || "No comment provided."}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex h-full shrink-0 flex-col items-end justify-between self-stretch text-right">
                                            <div
                                                className={cn(
                                                    "flex items-center justify-end gap-1.5 text-xs font-semibold",
                                                    tone.ratingClassName,
                                                )}
                                            >
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, index) => (
                                                        <Star
                                                            key={`${item.id}-overview-star-${index}`}
                                                            className={cn(
                                                                "size-3 fill-current",
                                                                index < item.rating
                                                                    ? tone.ratingClassName
                                                                    : "text-muted-foreground/20",
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                {item.rating}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {formatToSmartDate(item.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })()
                        
                    ))}
                </div>
            ) : (
                <EmptyState message="No recent feedback available." />
            )}
        </div>
    </div>
);

export default Overview;
