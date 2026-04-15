import { Button } from "@/components/ui/button"
import ChatbotRuleForm from "@/forms/Admin/ChatbotRule/ChatbotRuleForm"
import { useCreateChatbotRuleAdminMutation } from "@/hooks/admin/chatbot.rule.hook"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router"

const AddChatbotRule = () => {
    const navigate = useNavigate();
    const { mutateAsync } = useCreateChatbotRuleAdminMutation();

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/chatbot-rule">
                    <Button size="icon" variant="outline">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Add New Chatbot Rule
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create a new automated response rule for the chatbot
                    </p>
                </div>
            </div>

            <ChatbotRuleForm 
            oncancel={() => navigate("/admin/chatbot-rule")}
            onsubmit={async (data) => {
                await mutateAsync(data);
                navigate("/admin/chatbot-rule");
            }}
            />
        </div>
    )
}

export default AddChatbotRule