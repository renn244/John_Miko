import StatisticCards from "@/components/ui/StatisticCards";
import { useGetAccommodationStatsQuery } from "@/hooks/admin/accommodation.hook";
import { BedDouble, Home, LandPlot, Warehouse } from "lucide-react";

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
            title="Rooms"
            stat={stats?.room || 0}
            Icon={<BedDouble className="w-5 h-5 text-green-600" />}
            isLoading={statLoading}
            />
            
            <StatisticCards 
            title="Cottages"
            stat={stats?.cottage || 0}
            Icon={<LandPlot className="w-5 h-5 text-red-600" />}
            isLoading={statLoading}
            />

            <StatisticCards 
            title="Event Halls"
            stat={stats?.eventhall || 0}
            Icon={<Warehouse className="w-5 h-5 text-yellow-600" />}
            isLoading={statLoading}
            />
      
        </div>
    )
}

export default AccommodationStatistics
