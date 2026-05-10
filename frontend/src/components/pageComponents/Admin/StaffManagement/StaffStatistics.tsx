import StatisticCards from "@/components/ui/StatisticCards";
import { useGetStaffStatsQuery } from "@/hooks/admin/staff-management.hook";
import { Home, UserCheck, UserX, Users, UtensilsCrossed } from "lucide-react";

const StaffStatistics = () => {
    const { data: stats, isLoading } = useGetStaffStatsQuery();

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatisticCards
            title="Total Staff"
            className="col-span-2 md:col-span-1"
            Icon={<Users className="w-5 h-5 text-primary" />}
            stat={stats?.total || 0}
            isLoading={isLoading}
            />

            <StatisticCards
            title="Active"
            Icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
            stat={stats?.active || 0}
            isLoading={isLoading}
            />

            <StatisticCards
            title="Inactive"
            Icon={<UserX className="w-5 h-5 text-gray-600" />}
            stat={stats?.inactive || 0}
            isLoading={isLoading}
            />

            <StatisticCards
            title="Kitchen Staff"
            Icon={<UtensilsCrossed className="w-5 h-5 text-amber-600" />}
            stat={stats?.kitchen || 0}
            isLoading={isLoading}
            />

            <StatisticCards
            title="Resort Staff"
            Icon={<Home className="w-5 h-5 text-blue-600" />}
            stat={stats?.resort || 0}
            isLoading={isLoading}
            />
        </div>
    )
}

export default StaffStatistics
