export type DocumentEmbeddingInput = { title: string; text: string };

export type DocumentEvidence = {
  id: string;
  type: 'document';
  documentId: string;
  title: string;
  heading: string | null;
  text: string;
  similarity: number;
};

export type CatalogEvidence = {
  id: string;
  type: 'accommodation' | 'menu' | 'addon';
  title: string;
  text: string;
};

export type RagEvidence = DocumentEvidence | CatalogEvidence;

export type ConversationTurn = {
  role: 'user' | 'assistant';
  content: string;
};
