import KnowledgeDocumentForm from "@/components/pageComponents/Admin/Knowledge/KnowledgeDocumentForm";
import KnowledgeDocumentList from "@/components/pageComponents/Admin/Knowledge/KnowledgeDocumentList";
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
      <div className="flex shrink-0 flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Chatbot Knowledge
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Write public resort information and publish it when it is ready for
            guests.
          </p>
        </div>
        <Button onClick={beginNew}>
          <Plus /> New document
        </Button>
      </div>

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
