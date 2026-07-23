import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { Prisma } from 'src/generated/prisma/client';
import type { KnowledgeChunkInput } from 'src/knowledge/content/knowledge-content';
import { PrismaService } from 'src/prisma/prisma.service';
import { DocumentEvidence } from './rag.types';

const toVectorLiteral = (vector: number[]) => `[${vector.join(',')}]`;

@Injectable()
export class VectorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async search(embedding: number[]): Promise<DocumentEvidence[]> {
    const vector = toVectorLiteral(embedding);
    const threshold = Number(
      this.config.get<string>('RAG_SIMILARITY_THRESHOLD') || 0.55,
    );

    const rows = await this.prisma.$queryRaw<
      Array<{
        id: string;
        documentId: string;
        title: string;
        heading: string | null;
        content: string;
        similarity: number;
      }>
    >(Prisma.sql`
      SELECT c."id", c."documentId", d."title", c."heading", c."content",
        1 - (c."embedding" <=> ${vector}::vector) AS "similarity"
      FROM "KnowledgeChunk" c
      INNER JOIN "KnowledgeDocument" d ON d."id" = c."documentId"
      WHERE d."isPublished" = true
        AND 1 - (c."embedding" <=> ${vector}::vector) >= ${threshold}
      ORDER BY c."embedding" <=> ${vector}::vector
      LIMIT 5
    `);

    return rows.map((row) => ({
      ...row,
      type: 'document',
      text: row.content,
      similarity: Number(row.similarity),
    }));
  }

  async replaceDocumentChunks(
    tx: Prisma.TransactionClient,
    documentId: string,
    chunks: KnowledgeChunkInput[],
    embeddings: number[][],
  ) {
    if (chunks.length !== embeddings.length) {
      throw new Error('Every knowledge chunk must have one embedding');
    }

    await tx.knowledgeChunk.deleteMany({ where: { documentId } });

    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index];
      const vector = toVectorLiteral(embeddings[index]);

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "KnowledgeChunk"
          ("id", "documentId", "chunkIndex", "heading", "content", "embedding")
        VALUES
          (${randomUUID()}, ${documentId}, ${chunk.chunkIndex}, ${chunk.heading}, ${chunk.content}, ${vector}::vector)
      `);
    }
  }
}
