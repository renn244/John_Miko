import DeleteKnowledgeDocumentDialog from "@/features/admin/knowledge/components/DeleteKnowledgeDocumentDialog";
import KnowledgeDocumentList from "@/features/admin/knowledge/components/KnowledgeDocumentList";
import KnowledgeDocumentWorkspace from "@/features/admin/knowledge/components/KnowledgeDocumentWorkspace";
import { useKnowledgeAdminStore } from "@/features/admin/knowledge/store/knowledgeAdmin.store";
import AdminPageHeader from "@/features/admin/layout/components/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Knowledge = () => {
    const startNewDocument = useKnowledgeAdminStore(
        (state) => state.startNewDocument,
    );

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-5 xl:h-[calc(100vh-108px)] xl:flex-none xl:overflow-hidden">
            <AdminPageHeader
                className="shrink-0"
                title="Chatbot Knowledge"
                description="Write public resort information and publish it when it is ready for guests."
                actions={
                    <Button onClick={startNewDocument}>
                        <Plus /> New document
                    </Button>
                }
            />

            <div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)] xl:overflow-hidden">
                <KnowledgeDocumentList />

                <KnowledgeDocumentWorkspace />
            </div>

            <DeleteKnowledgeDocumentDialog />
        </div>
    );
};

export default Knowledge;
