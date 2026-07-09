import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart";
import { formatPeso } from "@/lib/utils";
import { Label, Pie, PieChart } from "recharts";
import type { RevenueLineChartPoint } from "./RevenueLineChart";

type RevenueBreakdownCardProps = {
    selected: RevenueLineChartPoint | null;
};

type RevenueBreakdownKey = keyof typeof chartConfig;

const chartConfig = {
    value: { label: "Amount" },
    accommodation: { label: "Accommodation", color: "var(--chart-1)" },
    preOrder: { label: "Pre-order", color: "var(--chart-2)" },
    guestFee: { label: "Guest fee", color: "var(--chart-3)" },
    privateClosure: { label: "Private closure", color: "var(--chart-4)" },
} satisfies ChartConfig;

const formatMonthLabel = (month: string) => {
    const [y, m] = month.split("-");
    const year = Number(y);
    const monthIndex = Number(m) - 1;

    if (!Number.isFinite(year) || !Number.isFinite(monthIndex)) return month;

    const date = new Date(year, monthIndex, 1);
    return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
};

type RevenueBreakdownTooltipProps = {
    active?: boolean;
    payload?: Array<{
        name?: string;
        value?: number | string;
        color?: string;
    }>;
    total: number;
};

const isRevenueBreakdownKey = (name: string): name is RevenueBreakdownKey =>
    name in chartConfig;

const formatBreakdownName = (name?: string) => {
    if (!name) return "Revenue";

    return isRevenueBreakdownKey(name) ? chartConfig[name].label : name;
};

function RevenueBreakdownTooltip({
    active,
    payload,
    total,
}: RevenueBreakdownTooltipProps) {
    if (!active || !payload?.length) return null;

    const item = payload[0];
    const value = Number(item?.value) || 0;
    const color = item?.color || "var(--primary)";
    const shareOfTotal = total > 0 ? (value / total) * 100 : 0;

    return (
        <div className="grid min-w-44 gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-xl">
            <div className="flex items-start gap-2">
                <span
                    className="mt-0.5 h-9 w-1.5 shrink-0 rounded-[4px]"
                    style={{ backgroundColor: color }}
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="truncate text-muted-foreground">
                        {formatBreakdownName(item?.name)}
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span
                            className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tabular-nums"
                            style={{
                                borderColor: color,
                                backgroundColor: `color-mix(in srgb, ${color} 14%, white)`,
                                color,
                            }}
                        >
                            {shareOfTotal.toFixed(1)}%
                        </span>
                        <span className="font-medium tabular-nums text-foreground">
                            {formatPeso(value)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="border-t border-border/60 pt-2">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-medium tabular-nums text-foreground">
                        {formatPeso(total)}
                    </span>
                </div>
            </div>
        </div>
    );
}

const RevenueBreakdownCard = ({ selected }: RevenueBreakdownCardProps) => {
    if (!selected) {
        return (
            <div className="rounded-xl border border-border/70 bg-background p-4 shadow-sm md:p-5">
                <h3 className="text-base font-semibold text-foreground">Breakdown</h3>
                <div className="mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    Select a month in the chart to see the revenue breakdown.
                </div>
            </div>
        );
    }

    const pieData = [
        {
            name: "accommodation",
            value: Number(selected.accommodationAmount) || 0,
            fill: "var(--color-accommodation)",
        },
        {
            name: "preOrder",
            value: Number(selected.preOrderAmount) || 0,
            fill: "var(--color-preOrder)",
        },
        {
            name: "guestFee",
            value: Number(selected.guestFeeAmount) || 0,
            fill: "var(--color-guestFee)",
        },
        {
            name: "privateClosure",
            value: Number(selected.privateClosureRevenueAmount) || 0,
            fill: "var(--color-privateClosure)",
        },
    ];

    const total = Number(selected.totalAmount) || 0;
    const totalBreakdown = pieData.reduce(
        (sum, item) => sum + (Number(item.value) || 0),
        0,
    );
    const hasAnyBreakdown = totalBreakdown > 0;

    return (
        <div className="rounded-xl border border-border/70 bg-background p-4 shadow-sm md:p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-foreground">Breakdown</h3>
                    <p className="text-xs text-muted-foreground">
                        {formatMonthLabel(selected.month)}
                    </p>
                </div>

                <div className="text-right">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="text-base font-semibold text-foreground">
                        {formatPeso(total)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {Number(selected.count || 0).toLocaleString()} transactions
                    </div>
                </div>
            </div>

            {!hasAnyBreakdown ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    No revenue breakdown for this month.
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square w-full max-w-72"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <RevenueBreakdownTooltip total={total} />
                                }
                            />
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={70}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                                            return null;
                                        }

                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {formatPeso(total)}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Breakdown
                                                </tspan>
                                            </text>
                                        );
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </div>
            )}
        </div>
    );
};

export default RevenueBreakdownCard;
