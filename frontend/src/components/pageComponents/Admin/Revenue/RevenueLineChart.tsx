import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { formatPeso } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export type RevenueLineChartPoint = {
    month: string;
    count: number;
    totalAmount: number;
    accommodationAmount: number;
    preOrderAmount: number;
    addOnAmount: number;
    guestFeeAmount: number;
    privateClosureRevenueAmount: number;
};

type RevenueLineChartProps = {
    data: RevenueLineChartPoint[];
    isLoading: boolean;
    selectedMonth: string | null;
    onSelectMonth: (month: string) => void;
};

const chartConfig = {
    totalAmount: {
        label: "Total revenue",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

const formatMonthLabel = (month: string) => {
    const [y, m] = month.split("-");
    const year = Number(y);
    const monthIndex = Number(m) - 1;

    if (!Number.isFinite(year) || !Number.isFinite(monthIndex)) return month;

    const date = new Date(year, monthIndex, 1);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
    }).format(date);
};

const formatMonthTick = (month: string) => {
    const [y, m] = month.split("-");
    const year = Number(y);
    const monthIndex = Number(m) - 1;

    if (!Number.isFinite(year) || !Number.isFinite(monthIndex)) return month;

    const date = new Date(year, monthIndex, 1);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "2-digit",
    }).format(date);
};

type RevenueLineTooltipProps = {
    active?: boolean;
    payload?: Array<{ payload?: RevenueLineChartPoint; color?: string }>;
    data: RevenueLineChartPoint[];
};

const formatPercentageChange = (value: number) => {
    const roundedValue = Math.abs(value).toFixed(1);
    return `${value >= 0 ? "+" : "-"}${roundedValue}%`;
};

function RevenueLineTooltip({
    active,
    payload,
    data,
}: RevenueLineTooltipProps) {
    if (!active || !payload?.length) return null;

    const point = payload[0]?.payload;
    const accentColor = payload[0]?.color || "var(--color-totalAmount)";
    if (!point) return null;

    const currentIndex = data.findIndex((row) => row.month === point.month);
    const previousPoint = currentIndex > 0 ? data[currentIndex - 1] : null;
    const previousRevenue = Number(previousPoint?.totalAmount) || 0;
    const currentRevenue = Number(point.totalAmount) || 0;

    const revenueChange =
        previousRevenue > 0
            ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
            : null;

    const comparisonToneClassName =
        revenueChange !== null && revenueChange < 0
            ? "border-rose-200 bg-rose-50 text-rose-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700";
    const ComparisonIcon =
        revenueChange !== null && revenueChange < 0 ? TrendingDown : TrendingUp;

    return (
        <div className="grid min-w-48 gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-xl">
            <div className="flex items-stretch gap-2">
                <span
                    className="w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: accentColor }}
                />
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-medium text-foreground">
                            {formatMonthLabel(point.month)}
                        </span>
                        <span className="font-medium tabular-nums text-foreground">
                            {formatPeso(currentRevenue)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Revenue Entries</span>
                        <span className="font-medium tabular-nums text-foreground">
                            {Number(point.count || 0).toLocaleString()}
                        </span>
                    </div>
                    {revenueChange !== null ? (
                        <div className="mt-1 flex items-center gap-2 pt-0.5">
                            <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${comparisonToneClassName}`}
                            >
                                <ComparisonIcon className="mr-1 size-3" />
                                {formatPercentageChange(revenueChange)}
                            </span>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

const RevenueLineChart = ({
    data,
    isLoading,
    selectedMonth,
    onSelectMonth,
}: RevenueLineChartProps) => {
    const hasAnyData = useMemo(
        () => data.some((row) => Number(row.totalAmount) > 0 || Number(row.count) > 0),
        [data],
    );

    return (
        <div className="rounded-xl border border-border/70 bg-background p-4 shadow-sm md:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-base font-semibold text-foreground">
                        Revenue Trend
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Monthly revenue for the last 12 months
                    </p>
                </div>

                {hasAnyData ? (
                    <Select
                        value={selectedMonth || ""}
                        onValueChange={(value) =>
                            onSelectMonth(value === "none" ? "" : value)
                        }
                    >
                        <SelectTrigger className="max-w-62.5">
                            <SelectValue placeholder="Select a month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Months</SelectLabel>
                                <SelectItem value="none">None</SelectItem>
                                {data.map((item) => (
                                    <SelectItem key={item.month} value={item.month}>
                                        {formatMonthLabel(item.month)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                ) : null}
            </div>

            <div className="h-72 w-full md:h-80 lg:h-96">
                {isLoading ? (
                    <LoadingSpinner className="size-6 text-primary" />
                ) : !data.length ? (
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                        No revenue data found.
                    </div>
                ) : !hasAnyData ? (
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                        No completed payments in this range.
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="h-full w-full aspect-auto"
                    >
                        <LineChart
                            accessibilityLayer
                            data={data}
                            margin={{ left: 12, right: 12, top: 10, bottom: 30 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                minTickGap={16}
                                tickFormatter={formatMonthTick}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tickFormatter={(value) => formatPeso(Number(value) || 0)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<RevenueLineTooltip data={data} />}
                            />
                            <Line
                                type="monotone"
                                dataKey="totalAmount"
                                stroke="var(--color-totalAmount)"
                                connectNulls
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ChartContainer>
                )}
            </div>
        </div>
    );
};

export default RevenueLineChart;
