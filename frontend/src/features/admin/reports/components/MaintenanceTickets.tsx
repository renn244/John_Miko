import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetMaintenanceReportQuery, useGetStaffActivityReportQuery } from "@/features/admin/reports/hooks/useAdminReports";
import { toDateOnly } from "@/lib/date.util";
import { LogIn, LogOut, Wrench } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

const chartConfig = {
    value: {
        label: "Tickets",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

const maintenanceColors = ["#F59E0B", "#10B981"];

const MaintenanceTickets = ({ selectedDate }: { selectedDate: Date }) => {
    const selectedDateValue = toDateOnly(selectedDate);
    const { data: maintenance, isLoading: maintenanceLoading } = useGetMaintenanceReportQuery(selectedDateValue);
    const { data: report, isLoading: staffLoading } = useGetStaffActivityReportQuery(selectedDateValue);

    if (maintenanceLoading || staffLoading) {
        return (
            <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                <div className="flex min-h-80 items-center justify-center">
                    <LoadingSpinner className="size-6 text-primary" />
                </div>
            </div>
        );
    }

    if (!maintenance || !report) {
        return (
            <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                <div className="flex min-h-80 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 text-sm text-muted-foreground">
                    No maintenance report available for this date.
                </div>
            </div>
        );
    }

    const ticketChartData = [
        { label: "Created", value: maintenance.newTickets, fill: maintenanceColors[0] },
        { label: "Resolved", value: maintenance.resolvedTickets, fill: maintenanceColors[1] },
    ];

    const reportSummary = [
        {
            label: "Check-in",
            value: report.checkInReportToday,
            icon: LogIn,
            cardClassName: "bg-blue-50/70 text-blue-700",
            iconClassName: "bg-blue-100 text-blue-700",
        },
        {
            label: "Check-out",
            value: report.checkOutReportToday,
            icon: LogOut,
            cardClassName: "bg-violet-50/70 text-violet-700",
            iconClassName: "bg-violet-100 text-violet-700",
        },
        {
            label: "Maintenance",
            value: report.maintenanceReportToday,
            icon: Wrench,
            cardClassName: "bg-amber-50/70 text-amber-700",
            iconClassName: "bg-amber-100 text-amber-700",
        },
    ];

    return (
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                    Maintenance Tickets
                </h3>
                <p className="text-sm text-muted-foreground">
                    Ticket flow and staff report activity for the selected date.
                </p>
            </div>

            <div className="mt-5 h-64 w-full">
                <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                    <BarChart
                        accessibilityLayer
                        data={ticketChartData}
                        margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} allowDecimals={false} />
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const item = payload[0]?.payload as (typeof ticketChartData)[number] | undefined;
                                if (!item) return null;

                                return (
                                    <div className="grid min-w-36 gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-xl">
                                        <div className="flex items-stretch gap-2">
                                            <span
                                                className="w-1 shrink-0 rounded-full"
                                                style={{ backgroundColor: item.fill }}
                                            />
                                            <div className="flex-1 space-y-1">
                                                <div className="font-medium text-foreground">
                                                    {item.label}
                                                </div>
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="text-muted-foreground">
                                                        Tickets
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {item.value}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <Bar dataKey="value" radius={8} barSize={40}>
                            {ticketChartData.map((item) => (
                                <Cell key={item.label} fill={item.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {reportSummary.map((item) => (
                    <div
                        key={item.label}
                        className={`rounded-lg px-3 py-3 ${item.cardClassName}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground/70">
                                    {item.label}
                                </p>
                                <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                                    {item.value}
                                </p>
                            </div>
                            <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.iconClassName}`}>
                                <item.icon className="size-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default MaintenanceTickets;
