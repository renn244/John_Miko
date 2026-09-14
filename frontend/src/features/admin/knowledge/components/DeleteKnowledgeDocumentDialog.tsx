import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
    useDeleteKnowledgeDocumentMutation,
    useGetKnowledgeDocumentByIdQuery,
} from "@/features/admin/knowledge/hooks/useKnowledge";
import { useKnowledgeAdminStore } from "@/features/admin/knowledge/store/knowledgeAdmin.store";
import type { KnowledgeDocument } from "@/features/admin/knowledge/types/knowledge.type";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DeleteKnowledgeDocumentDialog = () => {
    const isDeleteOpen = useKnowledgeAdminStore((state) => state.isDeleteOpen);
    const deleteDocumentId = useKnowledgeAdminStore((state) => state.deleteDocumentId);
    const setIsDeleteOpen = useKnowledgeAdminStore((state) => state.setIsDeleteOpen);
    const setDeleteDocumentId = useKnowledgeAdminStore((state) => state.setDeleteDocumentId);
    const { data: document, isLoading, error, refetch, isRefetching } =
        useGetKnowledgeDocumentByIdQuery(deleteDocumentId ?? null);

    return (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent
                className="sm:max-w-xl"
                onCloseAutoFocus={() => setDeleteDocumentId(undefined)}
            >
                {isLoading && (
                    <div className="flex h-64 items-center justify-center">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}

                {error && (
                    <ErrorDialog
                        onBack={() => setIsDeleteOpen(false)}
                        onRetry={refetch}
                        retryLoading={isRefetching}
                    />
                )}

                {!document && !isLoading && !error && isDeleteOpen && (
                    <NotFoundDialog
                        onBack={() => setIsDeleteOpen(false)}
                        onRetry={refetch}
                        retryLoading={isRefetching}
                        title="Knowledge Document Not Found"
                    />
                )}

                {document && <DeleteKnowledgeDocument document={document} />}
            </DialogContent>
        </Dialog>
    );
};

const DeleteKnowledgeDocument = ({ document }: { document: KnowledgeDocument }) => {
    const completeDelete = useKnowledgeAdminStore((state) => state.completeDelete);
    const setDeleteDocumentId = useKnowledgeAdminStore((state) => state.setDeleteDocumentId);
    const deleteKnowledgeDocument = useDeleteKnowledgeDocumentMutation();

    const handleDelete = async () => {
        try {
            await deleteKnowledgeDocument.mutateAsync(document.id);
            completeDelete();
            toast.success("Document deleted");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong.");
        }
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Delete Knowledge Document</DialogTitle>
                <DialogDescription>
                    Review the document details before permanently deleting it.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-lg border-2 border-destructive/50 bg-destructive/10 p-4">
                    <AlertTriangle className="mt-0.5 size-6 shrink-0 text-destructive" />
                    <div>
                        <h3 className="mb-1 text-sm font-bold text-destructive">
                            Warning: This action cannot be undone.
                        </h3>
                        <p className="text-sm text-destructive/80">
                            This document will be permanently removed and its information
                            will no longer be available to the chatbot.
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border bg-muted/40 p-4">
                    <h4 className="mb-3 text-sm font-semibold">
                        Document to be deleted:
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-muted-foreground">Title:</span>
                            <span className="text-right font-semibold">
                                {document.title}
                            </span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="text-right font-medium">
                                {document.category}
                            </span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium">
                                {document.isPublished ? "Published" : "Draft"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDeleteDocumentId(undefined)}
                    disabled={deleteKnowledgeDocument.isPending}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteKnowledgeDocument.isPending}
                >
                    {deleteKnowledgeDocument.isPending ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <Trash2 /> Delete Permanently
                        </>
                    )}
                </Button>
            </DialogFooter>
        </>
    );
};

export default DeleteKnowledgeDocumentDialog;
