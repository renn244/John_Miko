import StatisticCards from "@/components/ui/StatisticCards";
import { useGetDailyMetricsQuery } from "@/features/admin/reports/hooks/useAdminReports";
import { toDateOnly } from "@/lib/date.util";
import { BedDouble, CalendarCheck, CircleCheckBig, Wrench } from "lucide-react";

const unavailableValue = "—";

const DailyMetrics = ({ selectedDate }: { selectedDate: Date }) => {
    const selectedDateValue = toDateOnly(selectedDate);
    const dailyMetrics = useGetDailyMetricsQuery(selectedDateValue);

    const bookingValue = dailyMetrics.isError || !dailyMetrics.data
        ? unavailableValue
        : dailyMetrics.data.bookings;
    const occupancyValue = dailyMetrics.isError || !dailyMetrics.data
        ? unavailableValue
        : `${dailyMetrics.data.occupancyRate}%`;
    const newTicketsValue = dailyMetrics.isError || !dailyMetrics.data
        ? unavailableValue
        : dailyMetrics.data.newTickets;
    const resolvedTicketsValue = dailyMetrics.isError || !dailyMetrics.data
        ? unavailableValue
        : dailyMetrics.data.resolvedTickets;

    const cards = [
        {
            title: "Bookings",
            stat: bookingValue,
            Icon: <CalendarCheck />,
            isLoading: dailyMetrics.isLoading,
            accentClassName: "border-l-blue-500",
            iconContainerClassName: "bg-blue-500",
        },
        {
            title: "Stay-option occupancy",
            stat: occupancyValue,
            Icon: <BedDouble />,
            isLoading: dailyMetrics.isLoading,
            accentClassName: "border-l-violet-500",
            iconContainerClassName: "bg-violet-500",
        },
        {
            title: "New Tickets",
            stat: newTicketsValue,
            Icon: <Wrench />,
            isLoading: dailyMetrics.isLoading,
            accentClassName: "border-l-amber-500",
            iconContainerClassName: "bg-amber-500",
        },
        {
            title: "Resolved Tickets",
            stat: resolvedTicketsValue,
            Icon: <CircleCheckBig />,
            isLoading: dailyMetrics.isLoading,
            accentClassName: "border-l-emerald-500",
            iconContainerClassName: "bg-emerald-500",
        },
    ];

    return (
        <section className="self-start rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">Daily Metrics</h3>
                <p className="text-sm text-muted-foreground">
                    Operational summary for the selected date.
                </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {cards.map((card) => (
                    <StatisticCards
                        key={card.title}
                        {...card}
                        className="min-h-24"
                    />
                ))}
            </div>
        </section>
    );
};

export default DailyMetrics;
