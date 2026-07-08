import StatisticCards from "@/components/ui/StatisticCards";
import { useGetAddOnServiceStatsQuery } from "@/hooks/admin/add-on-service.hook";
import { formatPeso } from "@/lib/utils";
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <StatisticCards
                className="col-span-2 md:col-span-1"
                title="Total Services"
                Icon={<PlusCircle />}
                accentClassName="border-l-blue-500"
                iconContainerClassName="bg-blue-500"
                stat={safeStats.totalServices}
                isLoading={loading || isError}
            />

            <StatisticCards
                title="Total Stocks"
                Icon={<Boxes />}
                accentClassName="border-l-amber-500"
                iconContainerClassName="bg-amber-500"
                stat={safeStats.totalStocks}
                isLoading={loading || isError}
            />

            <StatisticCards
                title="Total Value"
                Icon={<Coins />}
                accentClassName="border-l-emerald-500"
                iconContainerClassName="bg-emerald-500"
                format={(value) => formatPeso(value)}
                stat={safeStats.totalValue}
                isLoading={loading || isError}
            />
        </div>
    );
};

export default AddOnServiceStatistics;
