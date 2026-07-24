CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE "KnowledgeArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

CREATE TABLE "KnowledgeArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "draftContentHtml" TEXT NOT NULL,
    "draftContentText" TEXT NOT NULL,
    "draftContentHash" TEXT NOT NULL,
    "status" "KnowledgeArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "activePublicationId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "KnowledgeArticle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "KnowledgePublication" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "titleSnapshot" TEXT NOT NULL,
    "categorySnapshot" TEXT NOT NULL,
    "contentText" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "embeddingModel" TEXT NOT NULL,
    "embeddingDimensions" INTEGER NOT NULL,
    "publishedById" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KnowledgePublication_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "heading" TEXT,
    "content" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "embedding" vector(768) NOT NULL,
    CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "KnowledgeArticle_activePublicationId_key" ON "KnowledgeArticle"("activePublicationId");
CREATE INDEX "KnowledgeArticle_status_updatedAt_idx" ON "KnowledgeArticle"("status", "updatedAt");
CREATE INDEX "KnowledgeArticle_createdById_idx" ON "KnowledgeArticle"("createdById");
CREATE UNIQUE INDEX "KnowledgePublication_articleId_version_key" ON "KnowledgePublication"("articleId", "version");
CREATE INDEX "KnowledgePublication_articleId_publishedAt_idx" ON "KnowledgePublication"("articleId", "publishedAt");
CREATE INDEX "KnowledgePublication_publishedById_idx" ON "KnowledgePublication"("publishedById");
CREATE UNIQUE INDEX "KnowledgeChunk_publicationId_chunkIndex_key" ON "KnowledgeChunk"("publicationId", "chunkIndex");
CREATE INDEX "KnowledgeChunk_articleId_idx" ON "KnowledgeChunk"("articleId");
CREATE INDEX "KnowledgeChunk_publicationId_idx" ON "KnowledgeChunk"("publicationId");

ALTER TABLE "KnowledgeArticle"
  ADD CONSTRAINT "KnowledgeArticle_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "KnowledgePublication"
  ADD CONSTRAINT "KnowledgePublication_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "KnowledgeArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "KnowledgePublication"
  ADD CONSTRAINT "KnowledgePublication_publishedById_fkey"
  FOREIGN KEY ("publishedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "KnowledgeArticle"
  ADD CONSTRAINT "KnowledgeArticle_activePublicationId_fkey"
  FOREIGN KEY ("activePublicationId") REFERENCES "KnowledgePublication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "KnowledgeChunk"
  ADD CONSTRAINT "KnowledgeChunk_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "KnowledgeArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "KnowledgeChunk"
  ADD CONSTRAINT "KnowledgeChunk_publicationId_fkey"
  FOREIGN KEY ("publicationId") REFERENCES "KnowledgePublication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
