import ChatbotRuleFilter from "@/components/pageComponents/Admin/ChatbotRule/ChatborRuleFilter"
import ChatbotRuleStatistics from "@/components/pageComponents/Admin/ChatbotRule/ChatbotRuleStatistics"
import ChatbotRuleTable from "@/components/pageComponents/Admin/ChatbotRule/ChatbotRuleTable"
import DeleteChatbotRuleDialog from "@/components/pageComponents/Admin/ChatbotRule/DeleteChatbotRuleDialog"
import ViewChatbotRuleDialog from "@/components/pageComponents/Admin/ChatbotRule/ViewChatbotRuleDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "react-router"

const ChatbotRule = () => {
    return (
        <div className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Chatbot Rule Management
                    </h1>
                    <p className="text-sm mt-1 text-muted-foreground">
                        Manage chatbot responses, keywords, and quick replies
                    </p>
                </div>
                <Link to="/admin/chatbot-rule/add">
                    <Button>
                        Add Rule
                        <Plus className="w-5 h-5 text-white" />
                    </Button>
                </Link>
            </div>

            <ChatbotRuleStatistics />

            <ChatbotRuleFilter />

            <ChatbotRuleTable />

            <ViewChatbotRuleDialog />

            <DeleteChatbotRuleDialog />
        </div>
    )
}

export default ChatbotRule