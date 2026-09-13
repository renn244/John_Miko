import DataPagination from "@/components/common/DataPagination";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetKnowledgeDocumentsQuery } from "@/features/admin/knowledge/hooks/useKnowledge";
import { FileText, Search } from "lucide-react";
import { useState } from "react";

type DocumentFilter = "ALL" | "DRAFT" | "PUBLISHED";

type KnowledgeDocumentListProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const KnowledgeDocumentList = ({
  selectedId,
  onSelect,
}: KnowledgeDocumentListProps) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DocumentFilter>("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetKnowledgeDocumentsQuery({
    search: search.trim() || undefined,
    isPublished: filter === "ALL" ? undefined : filter === "PUBLISHED",
    page,
    limit: 10,
  });

  return (
    <Card className="gap-4 p-4 xl:h-full xl:min-h-0 xl:overflow-hidden">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search documents"
          className="pl-9"
        />
      </div>

      <Select
        value={filter}
        onValueChange={(value) => {
          setFilter(value as DocumentFilter);
          setPage(1);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All documents</SelectItem>
          <SelectItem value="DRAFT">Drafts</SelectItem>
          <SelectItem value="PUBLISHED">Published</SelectItem>
        </SelectContent>
      </Select>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : data?.data.length ? (
          data.data.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/60 ${selectedId === item.id ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-2 text-sm font-semibold">
                  {item.title}
                </p>
                <Badge
                  className={
                    item.isPublished
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }
                >
                  {item.isPublished ? "published" : "draft"}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {item.category} · Updated{" "}
                {new Date(item.updatedAt).toLocaleDateString()}
              </p>
            </button>
          ))
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center text-center">
            <FileText className="mb-3 size-8 text-muted-foreground" />
            <p className="text-sm font-medium">No documents found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create one directly in the editor.
            </p>
          </div>
        )}
      </div>

      {data?.meta ? (
        <DataPagination
          meta={data.meta}
          page={page}
          onPageChange={setPage}
          summaryLabel="documents"
        />
      ) : null}
    </Card>
  );
};

export default KnowledgeDocumentList;
