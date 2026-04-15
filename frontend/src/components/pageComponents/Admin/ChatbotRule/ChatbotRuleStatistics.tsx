import StatisticCards from "@/components/ui/StatisticCards";
import { useGetChatbotRuleStatisticsAdminQuery } from "@/hooks/admin/chatbot.rule.hook";
import { AlertCircle, CheckCircle, MessageCircle } from "lucide-react";

const ChatbotRuleStatistics = () => {
    const { data: statistics, isLoading } = useGetChatbotRuleStatisticsAdminQuery();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatisticCards 
            title="Total Rules"
            Icon={<MessageCircle className="w-5 h-5 text-primary" />}
            stat={statistics?.total || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Active Rules"
            Icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
            stat={statistics?.active || 0}
            isLoading={isLoading}
            />

            <StatisticCards 
            title="Inactive Rules"
            Icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
            stat={statistics?.inactive || 0}
            isLoading={isLoading}
            />
        </div>
    )
}

export default ChatbotRuleStatistics