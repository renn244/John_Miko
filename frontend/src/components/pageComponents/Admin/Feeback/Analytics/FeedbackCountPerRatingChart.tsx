import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig
} from "@/components/ui/chart";
import { useGetFeedbackCountPerRatingQuery } from "@/hooks/admin/feedback.hook";
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import type { Interval } from "./feedback-analytics.utils";

const chartConfig = {
    count: { label: "Count" },
    "1": { label: "1 Star",  color: "var(--chart-1)" },
    "2": { label: "2 Stars", color: "var(--chart-2)" },
    "3": { label: "3 Stars", color: "var(--chart-3)" },
    "4": { label: "4 Stars", color: "var(--chart-4)" },
    "5": { label: "5 Stars", color: "var(--chart-5)" },
} satisfies ChartConfig;

type FeedbackCountPerRatingChartProps = {
    interval: Interval;
}

const FeedbackCountPerRatingChart = ({ interval }: FeedbackCountPerRatingChartProps) => {
    const countQuery = useGetFeedbackCountPerRatingQuery({ interval });

    const data = (countQuery.data ?? [])
        .slice()
        .sort((a, b) => a.rating - b.rating)
        .map((row) => ({
            rating: String(row.rating),
            count: row.count,
            fill: `var(--color-${row.rating})`,  
        }));

    const hasAnyData = data.some((d) => d.count > 0);
    const totalCount = useMemo(() => data.reduce((sum, d) => sum + d.count, 0), [data]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0 border-b">
                <CardTitle className="text-base">Feedback Count Per Rating</CardTitle>
                <CardDescription>Distribution of ratings (1–5)</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 px-0">
                <div className="h-80 w-full">
                    {countQuery.isLoading ? (
                        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                            Loading rating distribution...
                        </div>
                    ) : countQuery.isError ? (
                        <div className="h-full w-full flex items-center justify-center text-sm text-destructive">
                            Failed to load rating distribution.
                        </div>
                    ) : !hasAnyData ? (
                        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                            No feedback data available.
                        </div>
                    ) : (
                        <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-75"
                        >
                            <PieChart>
                                <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent />
                                }
                                />
                                <Pie
                                data={data}
                                dataKey="count"
                                nameKey="rating"
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
                                                    className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {totalCount.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                    >
                                                        Feedbacks
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default FeedbackCountPerRatingChart;