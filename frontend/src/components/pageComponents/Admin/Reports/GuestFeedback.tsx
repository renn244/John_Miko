import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetFeedbackReportQuery } from "@/hooks/admin/feedback.hook";
import { toDateOnly } from "@/lib/date.util";
import { Star } from "lucide-react";
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
const maxRating = 5;

const GuestFeedback = ({ selectedDate }: { selectedDate: Date }) => {
    const { data, isLoading } = useGetFeedbackReportQuery(toDateOnly(selectedDate));

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
                    No feedback report available for this date.
                </div>
            </div>
        );
    }

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
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground">
                        Guest Feedback
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Rating distribution and average sentiment for the selected date.
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Average Rating
                    </p>
                    <div className="mt-1 flex items-end justify-end gap-2">
                        <span className="text-2xl font-bold tracking-tight text-foreground">
                            {Number(data.averageOnDate).toFixed(1)}
                        </span>
                        <span className="pb-0.5 text-sm text-muted-foreground">/ 5</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_148px] xl:items-center">
                <div className="h-72">
                    <ChartContainer config={chartConfig} className="mx-auto h-full max-w-full aspect-auto">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const payloadItem = payload[0];
                                    const item = payloadItem?.payload as (typeof distribution)[number] | undefined;
                                    if (!item) return null;

                                    const ratingValue = Number(
                                        item.rating ?? payloadItem?.name ?? 0,
                                    );
                                    const filledStars = Number.isFinite(ratingValue)
                                        ? Math.max(0, Math.min(maxRating, ratingValue))
                                        : 0;

                                    return (
                                        <div className="grid min-w-44 gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-xl">
                                            <div className="flex items-stretch gap-2">
                                                <span
                                                    className="w-1 shrink-0 rounded-full"
                                                    style={{ backgroundColor: item.fill }}
                                                />
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-0.5">
                                                        {Array.from({ length: maxRating }).map((_, index) => (
                                                            <Star
                                                                key={`tooltip-${item.rating}-${index}`}
                                                                className={
                                                                    index < filledStars
                                                                        ? "size-3.5 fill-amber-400 text-amber-400"
                                                                        : "size-3.5 fill-muted/20 text-muted-foreground/30"
                                                                }
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="text-muted-foreground">
                                                            Feedbacks
                                                        </span>
                                                        <span className="font-medium text-foreground">
                                                            {item.count}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border-t border-border/60 pt-2">
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="font-medium text-foreground">
                                                        Average Rating
                                                    </span>
                                                    <span className="font-semibold text-foreground">
                                                        {Number(data.averageOnDate).toFixed(1)} / 5
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
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
                                                        className="fill-muted-foreground text-xs"
                                                    >
                                                        {data.receivedOnDate === 1 ? "Feedback" : "Feedbacks"}
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

                <div className="space-y-2">
                    {ratingsOrder.map((rating) => {
                        const item = data.distribution.find(
                            (entry) => String(entry.rating) === rating,
                        );
                        const count = Number(item?.count ?? 0);
                        const filledStars = Number(rating);

                        return (
                            <div
                                key={rating}
                                className="flex items-center justify-between rounded-lg px-2.5 py-1.5"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="size-2.5 rounded-[2px]"
                                        style={{ backgroundColor: ratingColors[rating] }}
                                    />
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: maxRating }).map((_, index) => (
                                            <Star
                                                key={`${rating}-${index}`}
                                                className={
                                                    index < filledStars
                                                        ? "size-3.5 fill-amber-400 text-amber-400"
                                                        : "size-3.5 fill-muted/20 text-muted-foreground/30"
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="min-w-4 text-right text-sm font-medium text-foreground">
                                    {count}
                                </span>
                            </div>
                        );
                    })}

                    <p className="px-2.5 pt-1 text-xs text-muted-foreground">
                        {data.receivedOnDate} {data.receivedOnDate === 1 ? "feedback" : "feedbacks"} received
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GuestFeedback;
