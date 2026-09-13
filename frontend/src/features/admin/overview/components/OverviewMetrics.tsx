import StatisticCards from "@/components/ui/StatisticCards";
import { useGetBookingOverviewQuery } from "@/features/admin/bookings/hooks/useAdminBookings";
import { useGetMaintenanceOverviewQuery } from "@/features/admin/maintenance/hooks/useAdminMaintenance";
import { useGetPaymentOverviewQuery } from "@/features/admin/payments/hooks/useAdminPayments";
import { formatPeso } from "@/lib/utils";
import {
    CalendarCheck,
    CreditCard,
    DollarSign,
    Wrench,
} from "lucide-react";

const OverviewMetrics = ({ selectedDate }: { selectedDate: string }) => {
    const bookingOverview = useGetBookingOverviewQuery(selectedDate);
    const paymentOverview = useGetPaymentOverviewQuery(selectedDate);
    const maintenanceOverview = useGetMaintenanceOverviewQuery(selectedDate);

    const cards = [
        {
            title: "Today's Bookings",
            stat: bookingOverview.data?.todayCount ?? 0,
            icon: <CalendarCheck />,
            accentClassName: "border-l-blue-500",
            iconContainerClassName: "bg-blue-500",
            isLoading: bookingOverview.isLoading,
        },
        {
            title: "Pending Payments",
            stat: paymentOverview.data?.pendingReviewCount ?? 0,
            icon: <CreditCard />,
            accentClassName: "border-l-amber-500",
            iconContainerClassName: "bg-amber-500",
            isLoading: paymentOverview.isLoading,
        },
        {
            title: "Open Maintenance",
            stat: maintenanceOverview.data?.openMaintenance ?? 0,
            icon: <Wrench />,
            accentClassName: "border-l-rose-500",
            iconContainerClassName: "bg-rose-500",
            isLoading: maintenanceOverview.isLoading,
        },
        {
            title: "Today Revenue",
            stat: paymentOverview.data?.todayRevenue ?? 0,
            format: (value: number) => formatPeso(value),
            icon: <DollarSign />,
            accentClassName: "border-l-emerald-500",
            iconContainerClassName: "bg-emerald-500",
            isLoading: paymentOverview.isLoading,
        },
    ];

    return (
        <section className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
            {cards.map((card) => (
                <StatisticCards
                    key={card.title}
                    title={card.title}
                    stat={card.stat}
                    format={card.format}
                    Icon={card.icon}
                    accentClassName={card.accentClassName}
                    iconContainerClassName={card.iconContainerClassName}
                    isLoading={card.isLoading}
                />
            ))}
        </section>
    );
};

export default OverviewMetrics;
