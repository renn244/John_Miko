import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Save, Send, Trash2 } from "lucide-react";

type KnowledgeDocumentToolbarProps = {
    isPublished: boolean;
    isExistingDocument: boolean;
    isDirty: boolean;
    isBusy: boolean;
    onDeleteRequest: () => void;
    onSaveDraft: () => void;
    onPublish: () => void;
    onUnpublish: () => void;
};

const KnowledgeDocumentToolbar = ({
    isPublished,
    isExistingDocument,
    isDirty,
    isBusy,
    onDeleteRequest,
    onSaveDraft,
    onPublish,
    onUnpublish,
}: KnowledgeDocumentToolbarProps) => {
    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Badge
                className={
                    isPublished
                        ? "h-8 bg-emerald-100 px-3 text-sm capitalize text-emerald-800"
                        : "h-8 bg-amber-100 px-3 text-sm capitalize text-amber-800"
                }
            >
                {isPublished ? "published" : "draft"}
            </Badge>

            <div className="flex flex-wrap items-center gap-2">
                {isExistingDocument && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onDeleteRequest}
                        disabled={isBusy}
                    >
                        <Trash2 /> Delete
                    </Button>
                )}

                <Button
                    type="button"
                    variant="outline"
                    onClick={onSaveDraft}
                    disabled={isBusy || (isExistingDocument && !isDirty)}
                >
                    <Save /> Save draft
                </Button>

                {isPublished && !isDirty ? (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onUnpublish}
                        disabled={isBusy}
                    >
                        Unpublish
                    </Button>
                ) : (
                    <Button type="button" onClick={onPublish} disabled={isBusy}>
                        <Send /> {isPublished ? "Republish" : "Publish"}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default KnowledgeDocumentToolbar;
