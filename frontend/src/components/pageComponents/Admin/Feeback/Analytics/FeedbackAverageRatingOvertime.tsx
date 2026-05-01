import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { useGetFeedbackAnalyticsQuery } from "@/hooks/admin/feedback.hook";
import { useMemo } from "react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";
import { groupAnalyticsToChartData, type Interval } from "./feedback-analytics.utils";

const chartConfig = {
	averageRating: {
		label: "Avg Rating",
		color: "hsl(var(--primary))",
	},
} satisfies ChartConfig;

type FeedbackAverageRatingOvertimeProps = {
	interval: Interval;
}

const FeedbackAverageRatingOvertime = ({ interval }: FeedbackAverageRatingOvertimeProps) => {
	const analyticsQuery = useGetFeedbackAnalyticsQuery({ interval });

	const chartData = useMemo(() => {
		const data = analyticsQuery.data ?? [];
		return groupAnalyticsToChartData(interval, data);
	}, [analyticsQuery.data, interval]);

	const hasAnyData = useMemo(
		() => chartData.some((p) => p.averageRating !== null),
	[chartData]);

	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle className="text-base">Average Rating Overtime</CardTitle>
				<CardDescription>This chart shows the average rating over time.</CardDescription>
			</CardHeader>
			<CardContent className="px-0">
				<div className="h-80 w-full">
					{analyticsQuery.isLoading ? (
						<div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
							Loading analytics...
						</div>
					) : analyticsQuery.isError ? (
						<div className="h-full w-full flex items-center justify-center text-sm text-destructive">
							Failed to load analytics.
						</div>
					) : !hasAnyData ? (
						<div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
							No feedback data available for this range.
						</div>
					) : (
						<ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
							<LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
								<CartesianGrid vertical={false} />
								<XAxis
								dataKey="label"
								tickLine={false}
								axisLine={false}
								tickMargin={10}
								interval={interval === "month" ? 2 : 0}
								/>
								<YAxis
								domain={[0, 5]}
								tickLine={false}
								axisLine={false}
								tickMargin={10}
								/>

								<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent labelFormatter={(_, payload) => (payload?.[0] as { payload?: { label?: string } } | undefined)?.payload?.label} />
								}
								/>

								<Line
								dataKey="averageRating"
								type="monotone"
								stroke="var(--color-primary)"
								strokeWidth={2}
								dot={false}
								connectNulls
								>
									<LabelList
									dataKey="averageRating"
									position="top"
									offset={12}
									className="fill-foreground"
									fontSize={12}
									fontWeight={500}
									formatter={(label) => (!!label ? label : "")}
									/>
								</Line>
							</LineChart>
						</ChartContainer>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default FeedbackAverageRatingOvertime;