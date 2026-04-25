import StatisticCards from "@/components/ui/StatisticCards";
import { useGetMaintenanceStatsQuery } from "@/hooks/admin/maintenance.hook";
import { AlertCircle, CheckCircle, Clock, Wrench } from "lucide-react";

const MaintenanceStatistics = () => {
    const { data: stats, isLoading } = useGetMaintenanceStatsQuery();

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatisticCards 
            title="Total Tickets"
            className="col-span-2 md:col-span-1"
            Icon={<Wrench className="w-5 h-5 text-primary" />}
            stat={stats?.total || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Pending"
            Icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
            stat={stats?.Pending || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="In Progress"
            Icon={<Clock className="w-5 h-5 text-blue-600" />}
            stat={stats?.InProgress || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Completed"
            Icon={<CheckCircle className="w-5 h-5 text-emerald-700" />}
            stat={stats?.Completed || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Closed"
            Icon={<CheckCircle className="w-5 h-5 text-red-700" />}
            stat={stats?.Closed || 0}
            isLoading={isLoading}
            />
        </div>
    )
}

export default MaintenanceStatistics