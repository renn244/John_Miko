import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetChatbotRuleByIdAdminQuery } from "@/hooks/admin/chatbot.rule.hook";
import { useChatbotAdminStore } from "@/store/admin/chatbotAdmin.store";
import type { ChatbotRule } from "@/types/chatbot-rule.types";

const ViewChatbotRuleDialog = () => {
    const viewId = useChatbotAdminStore((state) => state.viewId);
    const isViewOpen = useChatbotAdminStore((state) => state.isViewOpen);
    const setIsViewOpen = useChatbotAdminStore((state) => state.setIsViewOpen);
    
    const { data, isLoading, isError, refetch, isRefetching } = useGetChatbotRuleByIdAdminQuery(viewId);

    return (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent>
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {isError && (
                    <ErrorDialog 
                    onBack={() => setIsViewOpen(false)}
                    onRetry={() => refetch()} retryLoading={isRefetching}
                    />
                )}
                {(!isLoading && !isError && !data && isViewOpen) && (
                    <NotFoundDialog 
                    onBack={() => setIsViewOpen(false)}
                    onRetry={() => refetch()} retryLoading={isRefetching}
                    title="Chatbot Rule Not Found"
                    />
                )}
                {data && <ChatbotRuleDetails selectedRule={data} />}
            </DialogContent>
        </Dialog>
    )
}

const ChatbotRuleDetails = ({ selectedRule } : { selectedRule: ChatbotRule }) => {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Chatbot Rule Details</DialogTitle>
                <DialogDescription>
                    {selectedRule.id} <Badge>{selectedRule.isActive ? "Active" : "Inactive"}</Badge>
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">

                <div className="grid gap-2">
                    <Label className="text-muted-foreground">
                        Rule Name
                    </Label>
                    <p className="font-bold text-lg">
                        {selectedRule.name}
                    </p>
                </div>

                <div className="grid gap-2">
                    <Label className="text-muted-foreground">
                        Keywords
                    </Label>
                    <div className="flex flex-wrap gap-2">
                        {selectedRule.keywords.map((keyword) => (
                            <Badge className="rounded-sm px-3 py-1 text-sm" key={keyword}>
                                {keyword}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label className="text-muted-foreground">
                        Response Message
                    </Label>
                    <div className="p-3 rounded-sm bg-muted">
                        <p className="whitespace-pre-wrap">
                            {selectedRule.response}
                        </p>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label className="text-muted-foreground">
                        Quick Replies ({selectedRule.quickReplies.length})
                    </Label>

                    <div className="flex flex-wrap gap-2">
                        {selectedRule.quickReplies.length > 0 ? (
                            selectedRule.quickReplies.map((qr) => (
                                <Badge className="rounded-sm px-3 py-1 text-sm" key={qr}>
                                    {qr}
                                </Badge>
                            ))
                        ) : (
                            <div className="p-4 rounded-xl text-center bg-muted text-muted-foreground" style={{ backgroundColor: '#F9FAFB', color: '#9CA3AF' }}>
                                No quick replies configured
                            </div>
                        )}      
                    </div>              
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label className="text-muted-foreground">
                            Created
                        </Label>
                        <p className="text-sm">
                            {new Date(selectedRule.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-muted-foreground">
                            Last Updated
                        </Label>
                        <p className="text-sm">
                            {new Date(selectedRule.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewChatbotRuleDialog