import StatisticCards from "@/components/ui/StatisticCards";
import { useGetMenuItemStatsQuery } from "@/hooks/admin/menu-item.hook";
import { CheckCircle, UtensilsCrossed, XCircle } from "lucide-react";

const MenuItemStatistics = () => {
    
    const { data: stats, isLoading } = useGetMenuItemStatsQuery();

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <StatisticCards 
            className="col-span-2 md:col-span-1"
            title="Total Items"
            Icon={<UtensilsCrossed />}
            accentClassName="border-l-blue-500"
            iconContainerClassName="bg-blue-500"
            stat={stats?.total || 0}
            isLoading={isLoading}
            />
            
            <StatisticCards 
            title="Available"
            Icon={<CheckCircle />}
            accentClassName="border-l-emerald-500"
            iconContainerClassName="bg-emerald-500"
            stat={stats?.available || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Unavailable"
            Icon={<XCircle />}
            accentClassName="border-l-rose-500"
            iconContainerClassName="bg-rose-500"
            stat={stats?.unavailable || 0}
            isLoading={isLoading}
            />
        </div>
    )
}

export default MenuItemStatistics
