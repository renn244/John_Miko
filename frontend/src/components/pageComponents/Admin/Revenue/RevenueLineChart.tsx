import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis
} from "recharts";

export type RevenueLineChartPoint = {
	month: string; // YYYY-MM
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

const formatCurrency = (value: number) => `₱${value.toLocaleString()}`;

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
	payload?: Array<{ payload?: RevenueLineChartPoint }>;
};

function RevenueLineTooltip({ active, payload }: RevenueLineTooltipProps) {
	if (!active || !payload?.length) return null;
	const point = payload[0]?.payload;
	if (!point) return null;

	return (
		<div className="grid min-w-40 gap-2 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
			<div className="font-medium text-foreground">{formatMonthLabel(point.month)}</div>
			<div className="grid gap-1">
				<div className="flex items-center justify-between gap-4">
					<span className="font-medium">Total revenue:</span>
					<span className=" font-medium tabular-nums text-foreground">
						{formatCurrency(Number(point.totalAmount) || 0)}
					</span>
				</div>
				<div className="flex items-center justify-between gap-4">
					<span className="font-medium">Revenue entries:</span>
					<span className=" font-medium tabular-nums text-foreground">
						{Number(point.count || 0).toLocaleString()}
					</span>
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
		[data]
	);

	return (
		<div className="bg-card rounded-xl p-6 shadow-sm border border-border">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
				<div>
					<h3 className="text-lg font-bold text-foreground">Revenue</h3>
					<p className="text-xs text-muted-foreground">
						Monthly revenue for the last 12 months
					</p>
				</div>
				{hasAnyData && (
                    <Select
                    value={selectedMonth || ""}
                    onValueChange={(data) => {
                        if(data === "none") {
                            return onSelectMonth("");
                        }

                        return onSelectMonth(data);
                    }}
                    >
						<SelectTrigger className="max-w-62.5">
                            <SelectValue placeholder="Select a Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Months</SelectLabel>
                                <SelectItem value={"none"}>None</SelectItem>
								{data?.map((data) => 
									<SelectItem key={data.month} value={data.month}>{formatMonthLabel(data.month)}</SelectItem>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
			</div>

			<div className="h-72 md:h-80 lg:h-96 w-full">
				{isLoading ? (
					<LoadingSpinner className="w-6 h-6 text-primary" />
				) : !data.length ? (
					<div className="h-full w-full flex items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
						No revenue data found.
					</div>
				) : !hasAnyData ? (
					<div className="h-full w-full flex items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
						No completed payments in this range.
					</div>
				) : (
                    <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
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
                            tickFormatter={(v) => formatCurrency(Number(v) || 0)}
                            />

                            <ChartTooltip cursor={false} content={<RevenueLineTooltip />} />

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
