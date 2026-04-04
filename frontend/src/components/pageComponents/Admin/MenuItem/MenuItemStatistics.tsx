import StatisticCards from "@/components/ui/StatisticCards";
import { useGetMenuItemStatsQuery } from "@/hooks/admin/menu-item.hook";
import { CheckCircle, UtensilsCrossed, XCircle } from "lucide-react";

const MenuItemStatistics = () => {
    
    const { data: stats, isLoading } = useGetMenuItemStatsQuery();

    return (
        <div className="grid grid-cols-3 gap-4">
            <StatisticCards 
            title="Total Items"
            Icon={<UtensilsCrossed className="w-5 h-5 text-muted-foreground" />}
            stat={stats?.total || 0}
            isLoading={isLoading}
            />
            
            <StatisticCards 
            title="Available"
            Icon={<CheckCircle className="w-5 h-5 text-green-600" />}
            stat={stats?.available || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Unavailable"
            Icon={<XCircle className="w-5 h-5 text-red-600" />}
            stat={stats?.unavailable || 0}
            isLoading={isLoading}
            />
        </div>
    )
}

export default MenuItemStatistics