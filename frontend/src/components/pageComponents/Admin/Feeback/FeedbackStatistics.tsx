import StatisticCards from "@/components/ui/StatisticCards";
import { useGetFeedbackStatsQuery } from "@/hooks/admin/feedback.hook";
import { MessageSquare, Star, TrendingDown, TrendingUp } from "lucide-react";

const FeedbackStatistics = () => {
    const { data: stats, isLoading } = useGetFeedbackStatsQuery();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatisticCards 
            title="Total Feedback"
            Icon={<MessageSquare className="w-5 h-5 text-primary" />}
            stat={stats?.total || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Avg Rating"
            Icon={<Star className="w-5 h-5 text-amber-500" />}
            stat={stats?.averageRating || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Maximum Rating"
            Icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
            stat={stats?.maxRating || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Minimum Rating"
            Icon={<TrendingDown className="w-5 h-5 text-red-500" />}
            stat={stats?.minRating || 0}
            isLoading={isLoading}
            />
        </div>
    )
}

export default FeedbackStatistics