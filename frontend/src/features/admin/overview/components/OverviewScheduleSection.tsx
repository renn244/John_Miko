import { useGetBookingOverviewQuery } from "@/features/admin/bookings/hooks/useAdminBookings";
import OverviewTodayScheduleList from "./OverviewTodayScheduleList";
import { SectionHeader, surfaceClassName } from "./Overview.shared";

const OverviewScheduleSection = ({
    selectedDate,
}: {
    selectedDate: string;
}) => {
    const bookingOverview = useGetBookingOverviewQuery(selectedDate);

    return (
        <div className={`${surfaceClassName} overflow-hidden`}>
            <div className="border-b border-border/70 p-4">
                <SectionHeader
                    title="Today's Schedule"
                    linkTo={{
                        pathname: "/admin/booking",
                        search: `?bookingDate=${selectedDate}`,
                    }}
                    linkLabel="View bookings"
                />
            </div>
            <OverviewTodayScheduleList
                bookings={bookingOverview.data?.todaySchedule ?? []}
                isLoading={bookingOverview.isLoading}
            />
        </div>
    );
};

export default OverviewScheduleSection;
