import StatisticCards from "@/components/ui/StatisticCards";
import { useGetMaintenanceStatsQuery } from "@/features/admin/maintenance/hooks/useAdminMaintenance";
import { AlertCircle, CheckCircle, Clock, Wrench } from "lucide-react";

const MaintenanceStatistics = () => {
    const { data: stats, isLoading } = useGetMaintenanceStatsQuery();

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatisticCards 
            title="Total Tickets"
            className="col-span-2 md:col-span-1"
            Icon={<Wrench />}
            accentClassName="border-l-blue-500"
            iconContainerClassName="bg-blue-500"
            stat={stats?.total || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Pending"
            Icon={<AlertCircle />}
            accentClassName="border-l-amber-500"
            iconContainerClassName="bg-amber-500"
            stat={stats?.Pending || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="In Progress"
            Icon={<Clock />}
            accentClassName="border-l-blue-500"
            iconContainerClassName="bg-blue-500"
            stat={stats?.InProgress || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Completed"
            Icon={<CheckCircle />}
            accentClassName="border-l-emerald-500"
            iconContainerClassName="bg-emerald-500"
            stat={stats?.Completed || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Closed"
            Icon={<CheckCircle />}
            accentClassName="border-l-rose-500"
            iconContainerClassName="bg-rose-500"
            stat={stats?.Closed || 0}
            isLoading={isLoading}
            />
        </div>
    )
}

export default MaintenanceStatistics
