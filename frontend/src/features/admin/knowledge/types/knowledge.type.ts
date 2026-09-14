import type {
    PaginatedResponse,
    PaginationParams,
} from "@/types/pagination.type";

export type KnowledgeDocument = {
    id: string;
    title: string;
    category: string;
    contentHtml: string;
    contentText: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
};

export type KnowledgeDocumentInput = {
    title: string;
    category: string;
    contentHtml: string;
    contentText: string;
};

export type KnowledgeDocumentsQuery = PaginationParams & {
    search?: string;
    isPublished?: boolean;
};

export type KnowledgeDocumentsResponse = PaginatedResponse<KnowledgeDocument>;
