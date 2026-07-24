DROP TABLE "KnowledgeChunk";

ALTER TABLE "KnowledgeArticle"
  DROP CONSTRAINT "KnowledgeArticle_activePublicationId_fkey";

DROP TABLE "KnowledgePublication";
DROP TABLE "KnowledgeArticle";
DROP TYPE "KnowledgeArticleStatus";

CREATE TABLE "KnowledgeDocument" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "contentHtml" TEXT NOT NULL,
    "contentText" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "KnowledgeDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "heading" TEXT,
    "content" TEXT NOT NULL,
    "embedding" vector(768) NOT NULL,
    CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "KnowledgeDocument_isPublished_updatedAt_idx"
  ON "KnowledgeDocument"("isPublished", "updatedAt");
CREATE INDEX "KnowledgeDocument_createdById_idx"
  ON "KnowledgeDocument"("createdById");
CREATE UNIQUE INDEX "KnowledgeChunk_documentId_chunkIndex_key"
  ON "KnowledgeChunk"("documentId", "chunkIndex");
CREATE INDEX "KnowledgeChunk_documentId_idx"
  ON "KnowledgeChunk"("documentId");

ALTER TABLE "KnowledgeDocument"
  ADD CONSTRAINT "KnowledgeDocument_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "KnowledgeChunk"
  ADD CONSTRAINT "KnowledgeChunk_documentId_fkey"
  FOREIGN KEY ("documentId") REFERENCES "KnowledgeDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
