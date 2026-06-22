import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { useGetFeedbackReportQuery } from "@/hooks/admin/feedback.hook";
import { toDateOnly } from "@/lib/date.util";
import { Label, Pie, PieChart } from "recharts";

const chartConfig = {} satisfies ChartConfig;

const ratingColors: Record<string, string> = {
    "5": "#16a34a",
    "4": "#65a30d",
    "3": "#eab308",
    "2": "#f97316",
    "1": "#dc2626",
};

const ratingsOrder = ["5", "4", "3", "2", "1"];

const GuestFeedback = ({ selectedDate }: { selectedDate: Date }) => {
    const { data, isLoading } = useGetFeedbackReportQuery(toDateOnly(selectedDate));

    if (isLoading) return;

    if (!data) return;

    const distribution = data.distribution.length
        ? data.distribution.map(({ rating, count }) => ({
            rating: String(rating),
            count: Number(count),
            fill: ratingColors[String(rating)] ?? "#9ca3af",
        }))
        : [
            {
                rating: "0",
                count: 1,
                fill: "#e5e7eb",
            },
        ];
        
    return (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-foreground">
                    Guest Feedback
                </h3>

                <div className="flex items-center gap-3">
                    {ratingsOrder.map((r) => (
                        <div key={r} className="flex items-center gap-1 text-xs text-muted-foreground">
                            <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: ratingColors[r] }}
                            />
                            {r}★
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/40 mb-4">
                <div className="flex items-end gap-6">
                    <div>
                        <div className="text-4xl font-bold text-foreground mb-1">
                            {Number(data.averageOnDate).toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            / 5 avg
                        </div>
                    </div>

                    <div className="text-sm text-muted-foreground pb-2">
                        {data.receivedOnDate} received on this date
                    </div>
                </div>
            </div>

            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-75">
                <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                    <Pie
                        data={distribution}
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
                                                {data.receivedOnDate}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                {data.receivedOnDate === 0 ? "No Feedback" : "Feedbacks"}
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>
        </div>
    );
}

export default GuestFeedback;
