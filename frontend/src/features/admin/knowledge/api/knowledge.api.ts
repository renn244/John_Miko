import apiClient from "@/lib/apiClient";
import type {
    KnowledgeDocument,
    KnowledgeDocumentInput,
    KnowledgeDocumentsQuery,
    KnowledgeDocumentsResponse,
} from "@/features/admin/knowledge/types/knowledge.type";

export const knowledgeApi = {
    getKnowledgeDocuments: async (query: KnowledgeDocumentsQuery) => {
        const response = await apiClient.get("/knowledge", { params: query });

        if (response.status >= 400) {
            throw new Error(
                response.data.message || "Unable to load knowledge documents.",
            );
        }

        return response.data as KnowledgeDocumentsResponse;
    },
    getKnowledgeDocumentById: async (id: string) => {
        const response = await apiClient.get(`/knowledge/${id}`);

        if (response.status >= 400) {
            throw new Error(
                response.data.message || "Unable to load this document.",
            );
        }

        return response.data as KnowledgeDocument;
    },
    createKnowledgeDocument: async (data: KnowledgeDocumentInput) => {
        const response = await apiClient.post("/knowledge", data);

        if (response.status >= 400) {
            throw new Error(
                response.data.message || "Unable to create the document.",
            );
        }

        return response.data as KnowledgeDocument;
    },
    updateKnowledgeDocument: async (
        id: string,
        data: Partial<KnowledgeDocumentInput>,
    ) => {
        const response = await apiClient.patch(`/knowledge/${id}`, data);

        if (response.status >= 400) {
            throw new Error(
                response.data.message || "Unable to save the document.",
            );
        }

        return response.data as KnowledgeDocument;
    },
    publishKnowledgeDocument: async (id: string) => {
        const response = await apiClient.post(`/knowledge/${id}/publish`);

        if (response.status >= 400) {
            throw new Error(
                response.data.message || "Unable to publish the document.",
            );
        }

        return response.data as KnowledgeDocument;
    },
    unpublishKnowledgeDocument: async (id: string) => {
        const response = await apiClient.post(`/knowledge/${id}/unpublish`);

        if (response.status >= 400) {
            throw new Error(
                response.data.message || "Unable to unpublish the document.",
            );
        }

        return response.data as KnowledgeDocument;
    },
    deleteKnowledgeDocument: async (id: string) => {
        const response = await apiClient.delete(`/knowledge/${id}`);

        if (response.status >= 400) {
            throw new Error(
                response.data.message || "Unable to delete the document.",
            );
        }

        return response.data as { id: string };
    },
};
