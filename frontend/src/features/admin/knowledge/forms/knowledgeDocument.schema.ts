import z from "zod";

export const KnowledgeDocumentSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(160),
    category: z.string().trim().min(1, "Category is required").max(80),
    contentHtml: z.string(),
    contentText: z
        .string()
        .trim()
        .min(1, "Write some document content before saving."),
});

export type KnowledgeDocumentFormValues = z.infer<
    typeof KnowledgeDocumentSchema
>;
