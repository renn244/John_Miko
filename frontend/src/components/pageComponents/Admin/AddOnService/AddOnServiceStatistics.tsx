import StatisticCards from "@/components/ui/StatisticCards";
import { useGetAddOnServiceStatsQuery } from "@/hooks/admin/add-on-service.hook";
import { Boxes, Coins, PlusCircle } from "lucide-react";

const AddOnServiceStatistics = () => {
    const { data: stats, isLoading, isError } = useGetAddOnServiceStatsQuery();

    const loading = isLoading;

    const safeStats = {
        totalServices: stats?.totalServices ?? 0,
        totalStocks: stats?.totalStocks ?? 0,
        totalValue: stats?.totalValue ?? 0,
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatisticCards
                className="col-span-2 md:col-span-1"
                title="Total Services"
                Icon={<PlusCircle className="w-5 h-5 text-primary" />}
                stat={safeStats.totalServices}
                isLoading={loading || isError}
            />

            <StatisticCards
                title="Total Stocks"
                Icon={<Boxes className="w-5 h-5 text-primary" />}
                stat={safeStats.totalStocks}
                isLoading={loading || isError}
            />

            <StatisticCards
                title="Total Value"
                Icon={<Coins className="w-5 h-5 text-primary" />}
                format={(value) => `₱${value.toLocaleString()}`}
                stat={safeStats.totalValue}
                isLoading={loading || isError}
            />
        </div>
    );
};

export default AddOnServiceStatistics;
