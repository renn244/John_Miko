import KnowledgeDocumentForm from "@/features/admin/knowledge/forms/KnowledgeDocumentForm";
import {
    useCreateKnowledgeDocumentMutation,
    useGetKnowledgeDocumentByIdQuery,
    usePublishKnowledgeDocumentMutation,
    useUnpublishKnowledgeDocumentMutation,
    useUpdateKnowledgeDocumentMutation,
} from "@/features/admin/knowledge/hooks/useKnowledge";
import { useKnowledgeAdminStore } from "@/features/admin/knowledge/store/knowledgeAdmin.store";
import type { KnowledgeDocumentInput } from "@/features/admin/knowledge/types/knowledge.type";
import { toast } from "sonner";

const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Something went wrong.";

const KnowledgeDocumentWorkspace = () => {
    const selectedDocumentId = useKnowledgeAdminStore(
        (state) => state.selectedDocumentId,
    );
    const newDocumentVersion = useKnowledgeAdminStore(
        (state) => state.newDocumentVersion,
    );
    const selectDocument = useKnowledgeAdminStore(
        (state) => state.selectDocument,
    );
    const setDeleteDocumentId = useKnowledgeAdminStore(
        (state) => state.setDeleteDocumentId,
    );
    const { data: document, isLoading } = useGetKnowledgeDocumentByIdQuery(
        selectedDocumentId ?? null,
    );
    const createKnowledgeDocument = useCreateKnowledgeDocumentMutation();
    const updateKnowledgeDocument = useUpdateKnowledgeDocumentMutation();
    const publishKnowledgeDocument = usePublishKnowledgeDocumentMutation();
    const unpublishKnowledgeDocument = useUnpublishKnowledgeDocumentMutation();

    const isBusy = [
        createKnowledgeDocument,
        updateKnowledgeDocument,
        publishKnowledgeDocument,
        unpublishKnowledgeDocument,
    ].some((mutation) => mutation.isPending);

    const saveDocument = async (data: KnowledgeDocumentInput) => {
        const saved = selectedDocumentId
            ? await updateKnowledgeDocument.mutateAsync({
                  id: selectedDocumentId,
                  data,
              })
            : await createKnowledgeDocument.mutateAsync(data);

        if (!selectedDocumentId) {
            selectDocument(saved.id);
        }

        return saved;
    };

    const handleSaveDraft = async (data: KnowledgeDocumentInput) => {
        try {
            const wasPublished = document?.isPublished;
            await saveDocument(data);
            toast.success(
                wasPublished
                    ? "Draft saved and unpublished. Publish it again when ready."
                    : "Draft saved",
            );
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handlePublish = async (data: KnowledgeDocumentInput) => {
        try {
            const saved = await saveDocument(data);
            await publishKnowledgeDocument.mutateAsync(saved.id);
            toast.success("Document published to the chatbot");
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleUnpublish = async () => {
        if (!selectedDocumentId) return;

        try {
            await unpublishKnowledgeDocument.mutateAsync(selectedDocumentId);
            toast.success("Document unpublished");
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <KnowledgeDocumentForm
            key={selectedDocumentId ?? `new-${newDocumentVersion}`}
            document={document}
            isLoading={isLoading}
            isBusy={isBusy}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
            onDeleteRequest={() => {
                if (document) setDeleteDocumentId(document.id);
            }}
        />
    );
};

export default KnowledgeDocumentWorkspace;
