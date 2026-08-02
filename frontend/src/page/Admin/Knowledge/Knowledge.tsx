import KnowledgeDocumentForm from "@/components/pageComponents/Admin/Knowledge/KnowledgeDocumentForm";
import KnowledgeDocumentList from "@/components/pageComponents/Admin/Knowledge/KnowledgeDocumentList";
import AdminPageHeader from "@/components/pageComponents/Admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const Knowledge = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newDocumentVersion, setNewDocumentVersion] = useState(0);

  const beginNew = () => {
    setSelectedId(null);
    setNewDocumentVersion((current) => current + 1);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 xl:h-[calc(100vh-108px)] xl:flex-none xl:overflow-hidden">
      <AdminPageHeader
        className="shrink-0"
        title="Chatbot Knowledge"
        description="Write public resort information and publish it when it is ready for guests."
        actions={
          <Button onClick={beginNew}>
            <Plus /> New document
          </Button>
        }
      />

      <div className="grid min-h-0 flex-1 gap-5 xl:overflow-hidden xl:grid-cols-[320px_minmax(0,1fr)]">
        <KnowledgeDocumentList
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <KnowledgeDocumentForm
          key={selectedId ?? `new-${newDocumentVersion}`}
          selectedId={selectedId}
          onCreated={setSelectedId}
          onDeleted={beginNew}
        />
      </div>
    </div>
  );
};

export default Knowledge;
