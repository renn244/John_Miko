import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeminiService } from 'src/rag/gemini.service';
import { VectorService } from 'src/rag/vector.service';
import { chunkKnowledgeText } from './content/knowledge-content';
import {
  CreateKnowledgeDocumentDto,
  GetKnowledgeDocumentsQuery,
  UpdateKnowledgeDocumentDto,
} from './dto/knowledge.dto';

@Injectable()
export class KnowledgeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
    private readonly vectors: VectorService,
  ) {}

  async create(createdById: string, body: CreateKnowledgeDocumentDto) {
    const document = await this.prisma.knowledgeDocument.create({
      data: {
        ...body,
        isPublished: false,
        createdById,
      },
    });

    return document;
  }

  async list(query: GetKnowledgeDocumentsQuery) {
    const { search, page, limit, ...rest } = cleanPrismaWhere(query);
    const where: Prisma.KnowledgeDocumentWhereInput = {
      ...rest,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { category: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [documents, total] = await Promise.all([
      this.prisma.knowledgeDocument.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        ...getPaginationArgs(page, limit),
      }),
      this.prisma.knowledgeDocument.count({ where }),
    ]);

    return {
      data: documents,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  async getById(id: string) {
    const document = await this.prisma.knowledgeDocument.findUnique({
      where: { id },
    });

    if (!document) throw new NotFoundException('Knowledge document not found');

    return document;
  }

  async update(id: string, body: UpdateKnowledgeDocumentDto) {
    const existing = await this.getById(id);
    const data: Prisma.KnowledgeDocumentUpdateInput = {
      ...body,
      ...(existing.isPublished ? { isPublished: false } : {}),
    };

    const document = await this.prisma.$transaction(async (tx) => {
      if (existing.isPublished) {
        await tx.knowledgeChunk.deleteMany({ where: { documentId: id } });
      }
      return tx.knowledgeDocument.update({ where: { id }, data });
    });

    return document;
  }

  async publish(id: string) {
    const document = await this.getById(id);
    const chunks = chunkKnowledgeText(document.title, document.contentText);

    const embeddings = await this.gemini.embedDocuments(
      chunks.map((chunk) => ({ title: document.title, text: chunk.content })),
    );

    const publishedDocument = await this.prisma.$transaction(async (tx) => {
      await this.vectors.replaceDocumentChunks(tx, id, chunks, embeddings);

      return tx.knowledgeDocument.update({
        where: { id },
        data: {
          isPublished: true,
        },
      });
    });

    return publishedDocument;
  }

  async unpublish(id: string) {
    await this.getById(id);

    const document = await this.prisma.$transaction(async (tx) => {
      await tx.knowledgeChunk.deleteMany({ where: { documentId: id } });
      return tx.knowledgeDocument.update({
        where: { id },
        data: { isPublished: false },
      });
    });

    return document;
  }

  async remove(id: string) {
    await this.getById(id);

    await this.prisma.knowledgeDocument.delete({ where: { id } });

    return { id };
  }
}
