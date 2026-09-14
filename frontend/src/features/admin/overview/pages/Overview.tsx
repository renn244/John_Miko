import OverviewHeader from "@/features/admin/overview/components/OverviewHeader";
import OverviewMaintenancePressureCard from "@/features/admin/overview/components/OverviewMaintenancePressureCard";
import OverviewMetrics from "@/features/admin/overview/components/OverviewMetrics";
import OverviewNeedsAttentionSection from "@/features/admin/overview/components/OverviewNeedsAttentionSection";
import OverviewRecentBookingsCard from "@/features/admin/overview/components/OverviewRecentBookingsCard";
import OverviewRecentFeedbackCard from "@/features/admin/overview/components/OverviewRecentFeedbackCard";
import OverviewRevenueSection from "@/features/admin/overview/components/OverviewRevenueSection";
import OverviewScheduleSection from "@/features/admin/overview/components/OverviewScheduleSection";
import { removeTimeFromDate } from "@/lib/date.util";
import { format } from "date-fns";

const Overview = () => {
    const selectedDate = removeTimeFromDate(new Date());
    const overviewDateLabel = format(
        new Date(`${selectedDate}T00:00:00`),
        "MMMM d, yyyy",
    );

    return (
        <div className="space-y-5">
            <OverviewHeader overviewDateLabel={overviewDateLabel} />
            <OverviewMetrics selectedDate={selectedDate} />
            <OverviewRevenueSection />

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                <OverviewScheduleSection selectedDate={selectedDate} />
                <OverviewNeedsAttentionSection selectedDate={selectedDate} />
            </section>

            <section className="grid gap-5 xl:grid-cols-3">
                <OverviewMaintenancePressureCard selectedDate={selectedDate} />
                <OverviewRecentBookingsCard selectedDate={selectedDate} />
                <OverviewRecentFeedbackCard selectedDate={selectedDate} />
            </section>
        </div>
    );
};

export default Overview;
