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
            Icon={<Home />}
            accentClassName="border-l-blue-500"
            iconContainerClassName="bg-blue-500"
            isLoading={statLoading}
            />
            
            <StatisticCards 
            title="Rooms"
            stat={stats?.room || 0}
            Icon={<BedDouble />}
            accentClassName="border-l-emerald-500"
            iconContainerClassName="bg-emerald-500"
            isLoading={statLoading}
            />
            
            <StatisticCards 
            title="Cottages"
            stat={stats?.cottage || 0}
            Icon={<LandPlot />}
            accentClassName="border-l-amber-500"
            iconContainerClassName="bg-amber-500"
            isLoading={statLoading}
            />

            <StatisticCards 
            title="Event Halls"
            stat={stats?.eventhall || 0}
            Icon={<Warehouse />}
            accentClassName="border-l-violet-500"
            iconContainerClassName="bg-violet-500"
            isLoading={statLoading}
            />
      
        </div>
    )
}

export default AccommodationStatistics
