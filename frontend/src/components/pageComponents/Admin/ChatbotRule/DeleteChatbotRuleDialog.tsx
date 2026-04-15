import ErrorDialog from "@/components/common/dialog/ErrorDialog"
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { useDeleteChatbotRuleAdminMutation, useGetChatbotRuleByIdAdminQuery } from "@/hooks/admin/chatbot.rule.hook"
import { useChatbotAdminStore } from "@/store/admin/chatbotAdmin.store"
import type { ChatbotRule } from "@/types/chatbot-rule.types"
import { AlertTriangle } from "lucide-react"

const DeleteChatbotRuleDialog = () => {
    const isDeleteOpen = useChatbotAdminStore((state) => state.isDeleteOpen)
    const deleteId = useChatbotAdminStore((state) => state.deleteId)
    const setIsDeleteOpen = useChatbotAdminStore((state) => state.setIsDeleteOpen)

    const { data, isLoading, error, refetch, isRefetching } = useGetChatbotRuleByIdAdminQuery(deleteId);

    return (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="sm:max-w-xl">
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog 
                    onBack={() => setIsDeleteOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error && isDeleteOpen) && (
                    <NotFoundDialog 
                    onBack={() => setIsDeleteOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    title="Menu Item Not Found"
                    />
                )}
                {data && <DeleteConfirmationChatbotRule chatbotRule={data} />}
            </DialogContent>
        </Dialog>
    )
}

const DeleteConfirmationChatbotRule = ({ chatbotRule } : { chatbotRule: ChatbotRule }) => {
    const setIsDeleteOpen = useChatbotAdminStore((state) => state.setIsDeleteOpen);

    const { mutateAsync: deleteMenuItem, isPending } = useDeleteChatbotRuleAdminMutation(chatbotRule.id);

    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Delete Chatbot Rule
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

                <div className="flex items-start gap-4 p-4 rounded-lg border-2 border-destructive/50 bg-destructive/20">
                    <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-destructive/75" />
                    <div>
                        <h3 className="font-bold text-sm mb-1 text-destructive/75">
                            Warning: This action cannot be undone!
                        </h3>
                        <p className="text-sm text-destructive/75">
                            Deleting this chatbot rule will permanently remove it from the system.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="text-sm font-semibold mb-3">
                        Chatbot rule to be deleted:
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">
                                {chatbotRule.name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-medium">
                                {chatbotRule.id}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Keywords:</span>
                            <span className="font-medium capitalize">
                                {chatbotRule.keywords.length}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium">
                                {chatbotRule.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                    Are you absolutely sure you want to proceed with this deletion?
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" onClick={() => setIsDeleteOpen(false)} variant="outline">
                    Cancel
                </Button>
                <Button 
                type="button"
                variant="destructive"
                onClick={async () => {
                    await deleteMenuItem();
                    setIsDeleteOpen(false);
                }} 
                disabled={isPending} 
                >
                    {isPending ? <LoadingSpinner /> : 'Delete Permanently'}
                </Button>
            </div>
        </>
    )
}

export default DeleteChatbotRuleDialog