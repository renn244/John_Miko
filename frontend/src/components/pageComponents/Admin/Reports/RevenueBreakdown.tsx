import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetRevenueReportQuery } from "@/hooks/admin/report.hook";
import { toDateOnly } from "@/lib/date.util";
import { formatPeso } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

const chartConfig = {
    value: {
        label: "Revenue",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

const revenueColors = ["#1E73BE", "#16A34A", "#D97706", "#0EA5E9", "#7C3AED"];

const RevenueBreakdown = ({ selectedDate }: { selectedDate: Date }) => {
    const { data, isLoading } = useGetRevenueReportQuery(toDateOnly(selectedDate));

    if (isLoading) {
        return (
            <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                <div className="flex min-h-80 items-center justify-center">
                    <LoadingSpinner className="size-6 text-primary" />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                <div className="flex min-h-80 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 text-sm text-muted-foreground">
                    No revenue report available for this date.
                </div>
            </div>
        );
    }

    const chartData = [
        {
            key: "accommodation",
            label: "Accommodation",
            value: data.accommodationFee,
            fill: revenueColors[0],
        },
        {
            key: "guestFee",
            label: "Guest Fee",
            value: data.guestFee,
            fill: revenueColors[1],
        },
        {
            key: "preOrders",
            label: "Pre-orders",
            value: data.preOrderFee,
            fill: revenueColors[2],
        },
        {
            key: "addOns",
            label: "Add-ons",
            value: data.addOnServiceFee,
            fill: revenueColors[3],
        },
        {
            key: "private",
            label: "Private Closure",
            value: data.privateClosureRevenue,
            fill: revenueColors[4],
        },
    ];

    const hasAnyRevenue = chartData.some((item) => item.value > 0);

    return (
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground">
                        Revenue Breakdown
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Revenue sources for the selected date.
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Total Revenue
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                        {formatPeso(data.totalRevenue)}
                    </p>
                </div>
            </div>

            <div className="mt-5 h-56 w-full">
                {!hasAnyRevenue ? (
                    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 text-sm text-muted-foreground">
                        No revenue collected on this date.
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{ left: 12, right: 12, top: 4, bottom: 4 }}
                        >
                            <CartesianGrid horizontal={false} />
                            <XAxis
                                type="number"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tickFormatter={(value) => formatPeso(Number(value) || 0)}
                            />
                            <YAxis
                                type="category"
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                width={96}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const item = payload[0]?.payload as (typeof chartData)[number] | undefined;
                                    if (!item) return null;

                                    return (
                                        <div className="grid min-w-44 gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-xl">
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
                                                            Revenue
                                                        </span>
                                                        <span className="font-medium text-foreground">
                                                            {formatPeso(item.value)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border-t border-border/60 pt-2">
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="font-medium text-foreground">
                                                        Total
                                                    </span>
                                                    <span className="font-semibold text-foreground">
                                                        {formatPeso(data.totalRevenue)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                            <Bar dataKey="value" radius={6} barSize={22}>
                                {chartData.map((item) => (
                                    <Cell key={item.key} fill={item.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </div>
        </div>
    );
};

export default RevenueBreakdown;
