import StatisticCards from "@/components/ui/StatisticCards";
import { useGetFeedbackStatsQuery } from "@/hooks/admin/feedback.hook";
import { MessageSquare, Star, TrendingDown, TrendingUp } from "lucide-react";

const FeedbackStatistics = () => {
    const { data: stats, isLoading } = useGetFeedbackStatsQuery();

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatisticCards
                title="Total Feedback"
                Icon={<MessageSquare />}
                accentClassName="border-l-blue-500"
                iconContainerClassName="bg-blue-500"
                stat={stats?.total || 0}
                isLoading={isLoading}
            />

            <StatisticCards
                title="Avg Rating"
                Icon={<Star />}
                accentClassName="border-l-amber-500"
                iconContainerClassName="bg-amber-500"
                stat={stats?.averageRating || 0}
                isLoading={isLoading}
            />

            <StatisticCards
                title="Maximum Rating"
                Icon={<TrendingUp />}
                accentClassName="border-l-emerald-500"
                iconContainerClassName="bg-emerald-500"
                stat={stats?.maxRating || 0}
                isLoading={isLoading}
            />

            <StatisticCards
                title="Minimum Rating"
                Icon={<TrendingDown />}
                accentClassName="border-l-rose-500"
                iconContainerClassName="bg-rose-500"
                stat={stats?.minRating || 0}
                isLoading={isLoading}
            />
        </div>
    );
};

export default FeedbackStatistics;
