import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import type { RevenueLineChartPoint } from "./RevenueLineChart";

type RevenueBreakdownCardProps = {
	selected: RevenueLineChartPoint | null;
};

const chartConfig = {
	value: { label: "Amount" },
	accommodation: { label: "Accommodation", color: "var(--chart-1)" },
	preOrder: { label: "Pre-order", color: "var(--chart-2)" },
	guestFee: { label: "Guest fee", color: "var(--chart-3)" },
	privateClosure: { label: "Private closure", color: "var(--chart-4)" },
} satisfies ChartConfig;

const formatCurrency = (value: number) => `₱${value.toLocaleString()}`;

const formatMonthLabel = (month: string) => {
	const [y, m] = month.split("-");
	const year = Number(y);
	const monthIndex = Number(m) - 1;
	if (!Number.isFinite(year) || !Number.isFinite(monthIndex)) return month;

	const date = new Date(year, monthIndex, 1);
	return new Intl.DateTimeFormat("en-US", {
		month: "short"
	}).format(date);
};

const RevenueBreakdownCard = ({ selected }: RevenueBreakdownCardProps) => {
	if (!selected) {
		return (
			<div className="bg-card rounded-xl p-6 shadow-sm border border-border">
				<h3 className="text-lg font-bold text-foreground mb-2">Breakdown</h3>
				<div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
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
	const totalBreakdown = pieData.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
	const hasAnyBreakdown = totalBreakdown > 0;

	return (
		<div className="bg-card rounded-xl p-6 shadow-sm border border-border">
			<div className="flex items-start justify-between gap-4 mb-4">
				<div>
					<h3 className="text-lg font-bold text-foreground">Breakdown</h3>
					<p className="text-xs text-muted-foreground">
						{formatMonthLabel(selected.month)}
					</p>
				</div>

				<div className="text-right">
					<div className="text-xs text-muted-foreground">Total</div>
					<div className="text-base font-bold text-foreground">
						{formatCurrency(total)}
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
                    className="mx-auto w-full max-w-72 aspect-square"
					>
						<PieChart>
							<ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="name" />} />
							<Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={70}
                            strokeWidth={5}
							>
								<Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                                                    {formatCurrency(total)}
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
                                    }
                                }}
								/>
							</Pie>
						</PieChart>
					</ChartContainer>

					<div className="w-full space-y-2">
						<div className="flex items-center justify-between gap-3 text-sm">
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--color-accommodation)" }} />
								Accommodation
							</div>
							<div className=" font-medium tabular-nums text-foreground">
								{formatCurrency(Number(selected.accommodationAmount) || 0)}
							</div>
						</div>
						<div className="flex items-center justify-between gap-3 text-sm">
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--color-preOrder)" }} />
								Pre-order
							</div>
							<div className=" font-medium tabular-nums text-foreground">
								{formatCurrency(Number(selected.preOrderAmount) || 0)}
							</div>
						</div>
						<div className="flex items-center justify-between gap-3 text-sm">
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--color-guestFee)" }} />
								Guest fee
							</div>
							<div className=" font-medium tabular-nums text-foreground">
								{formatCurrency(Number(selected.guestFeeAmount) || 0)}
							</div>
						</div>
						<div className="flex items-center justify-between gap-3 text-sm">
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--color-privateClosure)" }} />
								Private closure
							</div>
							<div className=" font-medium tabular-nums text-foreground">
								{formatCurrency(Number(selected.privateClosureRevenueAmount) || 0)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default RevenueBreakdownCard;
