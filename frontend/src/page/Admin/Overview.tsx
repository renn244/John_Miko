import OverviewHeader from "@/components/pageComponents/Admin/Overview/OverviewHeader";
import OverviewMaintenancePressureCard from "@/components/pageComponents/Admin/Overview/OverviewMaintenancePressureCard";
import OverviewMetrics from "@/components/pageComponents/Admin/Overview/OverviewMetrics";
import OverviewNeedsAttentionSection from "@/components/pageComponents/Admin/Overview/OverviewNeedsAttentionSection";
import OverviewRecentBookingsCard from "@/components/pageComponents/Admin/Overview/OverviewRecentBookingsCard";
import OverviewRecentFeedbackCard from "@/components/pageComponents/Admin/Overview/OverviewRecentFeedbackCard";
import OverviewRevenueSection from "@/components/pageComponents/Admin/Overview/OverviewRevenueSection";
import OverviewScheduleSection from "@/components/pageComponents/Admin/Overview/OverviewScheduleSection";
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
