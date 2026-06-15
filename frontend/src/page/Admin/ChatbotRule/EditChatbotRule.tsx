import { Button } from "@/components/ui/button"
import ChatbotRuleForm from "@/forms/Admin/ChatbotRule/ChatbotRuleForm"
import { useGetChatbotRuleByIdAdminQuery, useUpdateChatbotRuleAdminMutation } from "@/hooks/admin/chatbot.rule.hook"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router"

const EditChatbotRule = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate();

  const { data: chatbotRule, isLoading, isError } = useGetChatbotRuleByIdAdminQuery(id);
  const { mutateAsync } = useUpdateChatbotRuleAdminMutation(id);
  
  if(isLoading) return null

  if(!chatbotRule) return null;

  if(isError) return null;

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
            Edit Chatbot Rule
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Modify the details of an existing chatbot rule
          </p>
        </div>
      </div>

      <ChatbotRuleForm 
      oncancel={() => navigate("/admin/chatbot-rule")}
      onsubmit={async (formData) => {
        await mutateAsync({ ...formData, id });
        navigate("/admin/chatbot-rule");
      }}
      initialData={{
        intentName: chatbotRule.name,
        trainingPhrases: chatbotRule.keywords,
        response: chatbotRule.response,
        quickReplies: chatbotRule.quickReplies,
        isActive: chatbotRule.isActive,
      }}
      isUpdate
      />
    </div>
  )
}

export default EditChatbotRule
