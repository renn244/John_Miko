import StatisticCards from "@/components/ui/StatisticCards";
import { useGetStaffStatsQuery } from "@/hooks/admin/staff-management.hook";
import { Home, UserRoundCog, Users, UtensilsCrossed } from "lucide-react";

const StaffStatistics = () => {
    const { data: stats, isLoading } = useGetStaffStatsQuery();

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatisticCards
            title="Total Staff"
            Icon={<Users />}
            accentClassName="border-l-blue-500"
            iconContainerClassName="bg-blue-500"
            stat={stats?.total || 0}
            isLoading={isLoading}
            />

            <StatisticCards
            title="Kitchen Staff"
            Icon={<UtensilsCrossed />}
            accentClassName="border-l-amber-500"
            iconContainerClassName="bg-amber-500"
            stat={stats?.kitchen || 0}
            isLoading={isLoading}
            />

            <StatisticCards
            title="Resort Staff"
            Icon={<Home />}
            accentClassName="border-l-cyan-500"
            iconContainerClassName="bg-cyan-500"
            stat={stats?.resort || 0}
            isLoading={isLoading}
            />

            <StatisticCards
            title="Maintenance"
            Icon={<UserRoundCog />}
            accentClassName="border-l-violet-500"
            iconContainerClassName="bg-violet-500"
            stat={stats?.maintenance || 0}
            isLoading={isLoading}
            />
        </div>
    )
}

export default StaffStatistics
