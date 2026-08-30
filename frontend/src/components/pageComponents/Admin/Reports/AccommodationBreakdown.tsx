import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetAccommodationReportQuery } from "@/hooks/admin/report.hook";
import { toDateOnly } from "@/lib/date.util";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
    occupied: {
        label: "Occupied",
        color: "#1E73BE",
    },
    free: {
        label: "Free",
        color: "#DCEAFE",
    },
} satisfies ChartConfig;

const accommodationTypeColors: Record<string, string> = {
    Rooms: "#1E73BE",
    Cottages: "#16A34A",
    "Event Halls": "#D97706",
};

const AccommodationBreakdown = ({ selectedDate }: { selectedDate: Date }) => {
    const { data, isLoading } = useGetAccommodationReportQuery(toDateOnly(selectedDate));

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
                    No accommodation report available for this date.
                </div>
            </div>
        );
    }

    const chartData = [
        {
            label: "Rooms",
            occupied: data.room.occupied,
            free: data.room.free,
            total: data.room.total,
        },
        {
            label: "Cottages",
            occupied: data.cottages.occupied,
            free: data.cottages.free,
            total: data.cottages.total,
        },
        {
            label: "Event Halls",
            occupied: data.eventHalls.occupied,
            free: data.eventHalls.free,
            total: data.eventHalls.total,
        },
    ];

    const hasAnyCapacity = chartData.some((item) => item.total > 0);

    return (
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground">
                        Accommodation Breakdown
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Occupied and free capacity across accommodation types.
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Occupancy Rate
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                        {data.occupancyRate}%
                    </p>
                </div>
            </div>

            <div className="mt-5 h-72 w-full">
                {!hasAnyCapacity ? (
                    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 text-sm text-muted-foreground">
                        No accommodation capacity configured.
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{ left: 0, right: 8, top: 4, bottom: 4 }}
                            barGap={6}
                        >
                            <CartesianGrid horizontal={false} />
                            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={10} />
                            <YAxis
                                dataKey="label"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={6}
                                width={78}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const item = payload[0]?.payload as (typeof chartData)[number] | undefined;
                                    if (!item) return null;
                                    const accentColor = accommodationTypeColors[item.label] ?? "#1E73BE";
                                    const occupancyRate =
                                        item.total > 0 ? Math.round((item.occupied / item.total) * 100) : 0;

                                    return (
                                        <div className="grid min-w-44 gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-xl">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="size-2.5 rounded-[2px]"
                                                    style={{ backgroundColor: accentColor }}
                                                />
                                                <div className="font-medium text-foreground">
                                                    {item.label}
                                                </div>
                                            </div>
                                            <div className="grid gap-1">
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="text-muted-foreground">Occupied</span>
                                                    <span className="font-medium text-foreground">
                                                        {item.occupied}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="text-muted-foreground">Free</span>
                                                    <span className="font-medium text-foreground">
                                                        {item.free}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="text-muted-foreground">Capacity</span>
                                                    <span className="font-medium text-foreground">
                                                        {item.total}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="border-t border-border/60 pt-2">
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="font-medium text-foreground">
                                                        Occupancy Rate
                                                    </span>
                                                    <span className="font-semibold text-foreground">
                                                        {occupancyRate}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                            <Bar
                                dataKey="occupied"
                                stackId="capacity"
                                fill="var(--color-occupied)"
                                radius={[6, 0, 0, 6]}
                                barSize={24}
                            />
                            <Bar
                                dataKey="free"
                                stackId="capacity"
                                fill="var(--color-free)"
                                radius={[0, 6, 6, 0]}
                                barSize={24}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </div>

            <div className="mt-4 rounded-lg bg-muted/30 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                        Total capacity
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                        {data.totalCapacity} units
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AccommodationBreakdown;
