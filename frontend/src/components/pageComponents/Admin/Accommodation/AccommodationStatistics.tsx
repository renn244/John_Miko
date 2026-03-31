import StatisticCards from "@/components/ui/StatisticCards";
import { useGetAccommodationStatsQuery } from "@/hooks/admin/accommodation.hook";
import { CheckCircle, Home, Info, XCircle } from "lucide-react";

const AccommodationStatistics = () => {

    const { data: stats, isLoading: statLoading } = useGetAccommodationStatsQuery();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <StatisticCards 
            title="Total"
            stat={stats?.total || 0}
            Icon={<Home className="w-5 h-5 text-blue-600" />}
            isLoading={statLoading}
            />
            
            <StatisticCards 
            title="Available"
            stat={stats?.available || 0}
            Icon={<CheckCircle className="w-5 h-5 text-green-600" />}
            isLoading={statLoading}
            />
            
            <StatisticCards 
            title="Unavailable"
            stat={stats?.unavailable || 0}
            Icon={<XCircle className="w-5 h-5 text-red-600" />}
            isLoading={statLoading}
            />

            <StatisticCards 
            title="Maintenance"
            stat={stats?.maintenance || 0}
            Icon={<Info className="w-5 h-5 text-yellow-600" />}
            isLoading={statLoading}
            />
      
        </div>
    )
}

export default AccommodationStatistics