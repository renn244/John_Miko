import DeleteKnowledgeDocumentDialog from "@/components/pageComponents/Admin/Knowledge/DeleteKnowledgeDocumentDialog";
import KnowledgeEditor from "@/components/pageComponents/Admin/Knowledge/KnowledgeEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  useCreateKnowledgeDocumentMutation,
  useGetKnowledgeDocumentByIdQuery,
  usePublishKnowledgeDocumentMutation,
  useUnpublishKnowledgeDocumentMutation,
  useUpdateKnowledgeDocumentMutation,
} from "@/hooks/admin/knowledge.hook";
import type {
  KnowledgeDocument,
  KnowledgeDocumentInput,
} from "@/types/admin/knowledge.type";
import { Save, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type KnowledgeDocumentFormProps = {
  selectedId: string | null;
  onCreated: (id: string) => void;
  onDeleted: () => void;
};

const emptyDraft = (): KnowledgeDocumentInput => ({
  title: "",
  category: "General",
  contentHtml: "<p></p>",
  contentText: "",
});

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

const KnowledgeDocumentForm = ({
  selectedId,
  onCreated,
  onDeleted,
}: KnowledgeDocumentFormProps) => {
  const [draft, setDraft] = useState<KnowledgeDocumentInput>(emptyDraft);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data: document } = useGetKnowledgeDocumentByIdQuery(selectedId);
  const createKnowledgeDocument = useCreateKnowledgeDocumentMutation();
  const updateKnowledgeDocument = useUpdateKnowledgeDocumentMutation();
  const publishKnowledgeDocument = usePublishKnowledgeDocumentMutation();
  const unpublishKnowledgeDocument = useUnpublishKnowledgeDocumentMutation();

  const isDirty = document
    ? draft.title !== document.title ||
      draft.category !== document.category ||
      draft.contentHtml !== document.contentHtml ||
      draft.contentText !== document.contentText
    : false;

  const isBusy = [
    createKnowledgeDocument,
    updateKnowledgeDocument,
    publishKnowledgeDocument,
    unpublishKnowledgeDocument,
  ].some((mutation) => mutation.isPending);

  useEffect(() => {
    if (!document) return;

    setDraft({
      title: document.title,
      category: document.category,
      contentHtml: document.contentHtml,
      contentText: document.contentText,
    });
  }, [document]);

  const saveDraft = async (): Promise<KnowledgeDocument> => {
    if (!draft.title.trim() || !draft.category.trim()) {
      throw new Error("Add a title and category before saving.");
    }

    if (!draft.contentText.trim()) {
      throw new Error("Write some document content before saving.");
    }

    const saved = selectedId
      ? await updateKnowledgeDocument.mutateAsync({
          id: selectedId,
          data: draft,
        })
      : await createKnowledgeDocument.mutateAsync(draft);

    if (!selectedId) {
      onCreated(saved.id);
    }

    return saved;
  };

  const handleSave = async () => {
    try {
      const wasPublished = document?.isPublished;
      await saveDraft();
      toast.success(
        wasPublished
          ? "Draft saved and unpublished. Publish it again when ready."
          : "Draft saved",
      );
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handlePublish = async () => {
    try {
      const saved = await saveDraft();
      await publishKnowledgeDocument.mutateAsync(saved.id);
      toast.success("Document published to the chatbot");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleUnpublish = async () => {
    if (!selectedId) return;

    try {
      await unpublishKnowledgeDocument.mutateAsync(selectedId);
      toast.success("Document unpublished");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <div className="min-w-0 space-y-4 xl:h-full xl:overflow-y-auto xl:pr-1">
      <Card className="gap-4 p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Badge
            className={
              document?.isPublished
                ? "h-8 bg-emerald-100 px-3 text-sm capitalize text-emerald-800"
                : "h-8 bg-amber-100 px-3 text-sm capitalize text-amber-800"
            }
          >
            {document?.isPublished ? "published" : "draft"}
          </Badge>

          <div className="flex flex-wrap items-center gap-2">
            {selectedId ? (
              <Button
                variant="destructive"
                onClick={() => setIsDeleteOpen(true)}
                disabled={isBusy || !document}
              >
                <Trash2 /> Delete
              </Button>
            ) : null}
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isBusy || (!!selectedId && (!document || !isDirty))}
            >
              <Save /> Save draft
            </Button>
            {document?.isPublished && !isDirty ? (
              <Button
                variant="outline"
                onClick={handleUnpublish}
                disabled={isBusy}
              >
                Unpublish
              </Button>
            ) : (
              <Button onClick={handlePublish} disabled={isBusy}>
                <Send /> {document?.isPublished ? "Republish" : "Publish"}
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
          <Field className="grid gap-2">
            <FieldLabel htmlFor="knowledge-title">Title</FieldLabel>
            <Input
              id="knowledge-title"
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="e.g. Pool rules and operating hours"
              maxLength={160}
            />
          </Field>

          <Field className="grid gap-2">
            <FieldLabel htmlFor="knowledge-category">Category</FieldLabel>
            <Input
              id="knowledge-category"
              value={draft.category}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
              placeholder="General"
              maxLength={80}
            />
          </Field>
        </div>
      </Card>

      <KnowledgeEditor
        value={draft.contentHtml}
        onChange={(content) =>
          setDraft((current) => ({ ...current, ...content }))
        }
      />

      {document ? (
        <DeleteKnowledgeDocumentDialog
          document={document}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onDeleted={onDeleted}
        />
      ) : null}
    </div>
  );
};

export default KnowledgeDocumentForm;
