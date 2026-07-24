import { knowledgeApi } from "@/api/admin/knowledge.api";
import type {
  KnowledgeDocumentInput,
  KnowledgeDocumentsQuery,
} from "@/types/admin/knowledge.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetKnowledgeDocumentsQuery = (query: KnowledgeDocumentsQuery) => {
  return useQuery({
    queryKey: ["knowledge", "admin", "list", query],
    queryFn: () => knowledgeApi.getKnowledgeDocuments(query),
    placeholderData: (previous) => previous,
    refetchOnWindowFocus: false,
  });
};

export const useGetKnowledgeDocumentByIdQuery = (id: string | null) => {
  return useQuery({
    queryKey: ["knowledge", "admin", "detail", id],
    queryFn: () => knowledgeApi.getKnowledgeDocumentById(id || ""),
    enabled: !!id,
  });
};

export const useCreateKnowledgeDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["knowledge", "admin", "create"],
    mutationFn: knowledgeApi.createKnowledgeDocument,
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge", "admin"] });
      queryClient.invalidateQueries({
        queryKey: ["knowledge", "admin", "detail", document.id],
      });
    },
  });
};

export const useUpdateKnowledgeDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["knowledge", "admin", "update"],
    mutationFn: ({ id, data }: { id: string; data: KnowledgeDocumentInput }) =>
      knowledgeApi.updateKnowledgeDocument(id, data),
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge", "admin"] });
      queryClient.invalidateQueries({
        queryKey: ["knowledge", "admin", "detail", document.id],
      });
    },
  });
};

export const usePublishKnowledgeDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["knowledge", "admin", "publish"],
    mutationFn: knowledgeApi.publishKnowledgeDocument,
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge", "admin"] });
      queryClient.invalidateQueries({
        queryKey: ["knowledge", "admin", "detail", document.id],
      });
    },
  });
};

export const useUnpublishKnowledgeDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["knowledge", "admin", "unpublish"],
    mutationFn: knowledgeApi.unpublishKnowledgeDocument,
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge", "admin"] });
      queryClient.invalidateQueries({
        queryKey: ["knowledge", "admin", "detail", document.id],
      });
    },
  });
};

export const useDeleteKnowledgeDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["knowledge", "admin", "delete"],
    mutationFn: knowledgeApi.deleteKnowledgeDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge", "admin"] });
    },
  });
};
