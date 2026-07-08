import StatisticCards from "@/components/ui/StatisticCards";
import { useGetChatbotRuleStatisticsAdminQuery } from "@/hooks/admin/chatbot.rule.hook";
import { AlertCircle, CheckCircle, MessageCircle } from "lucide-react";

const ChatbotRuleStatistics = () => {
    const { data: statistics, isLoading } = useGetChatbotRuleStatisticsAdminQuery();

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatisticCards 
            className="col-span-2 md:col-span-1"
            title="Total Rules"
            Icon={<MessageCircle />}
            accentClassName="border-l-blue-500"
            iconContainerClassName="bg-blue-500"
            stat={statistics?.total || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Active Rules"
            Icon={<CheckCircle />}
            accentClassName="border-l-emerald-500"
            iconContainerClassName="bg-emerald-500"
            stat={statistics?.active || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Inactive Rules"
            Icon={<AlertCircle />}
            accentClassName="border-l-amber-500"
            iconContainerClassName="bg-amber-500"
            stat={statistics?.inactive || 0}
            isLoading={isLoading}
            />
        </div>
    )
}

export default ChatbotRuleStatistics
