import { NotFoundException } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';

describe('KnowledgeService', () => {
  let prisma: any;
  let gemini: any;
  let vectors: any;
  let service: KnowledgeService;

  const document = {
    id: 'document-1',
    title: 'Guest Guide',
    category: 'Policies',
    contentHtml: '<h1>Welcome</h1><p>Public information</p>',
    contentText: 'Welcome\n\nPublic information',
    isPublished: false,
    createdById: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    const tx = {
      knowledgeDocument: { update: jest.fn() },
      knowledgeChunk: { deleteMany: jest.fn() },
      $executeRaw: jest.fn(),
    };
    prisma = {
      knowledgeDocument: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(async (callback: any) => callback(tx)),
      tx,
    };
    gemini = { embedDocuments: jest.fn() };
    vectors = { replaceDocumentChunks: jest.fn() };
    service = new KnowledgeService(prisma, gemini, vectors);
  });

  it('creates one unpublished document from the validated DTO body', async () => {
    prisma.knowledgeDocument.create.mockImplementation(({ data }: any) => ({
      ...document,
      ...data,
    }));

    await service.create('admin-1', {
      title: ' Guest Guide ',
      category: ' Policies ',
      contentHtml: '<h1>Welcome</h1><p>Public information</p>',
      contentText: '  Welcome\r\n\r\nPublic information  ',
    });

    expect(prisma.knowledgeDocument.create).toHaveBeenCalledWith({
      data: {
        title: ' Guest Guide ',
        category: ' Policies ',
        contentHtml: '<h1>Welcome</h1><p>Public information</p>',
        contentText: '  Welcome\r\n\r\nPublic information  ',
        isPublished: false,
        createdById: 'admin-1',
      },
    });
  });

  it('saving a published document unpublishes it and removes its chunks', async () => {
    prisma.knowledgeDocument.findUnique.mockResolvedValue({
      ...document,
      isPublished: true,
    });
    prisma.tx.knowledgeDocument.update.mockResolvedValue(document);

    await service.update('document-1', {
      contentHtml: '<p>Changed</p>',
      contentText: ' Changed ',
    });

    expect(prisma.tx.knowledgeChunk.deleteMany).toHaveBeenCalledWith({
      where: { documentId: 'document-1' },
    });
    expect(prisma.tx.knowledgeDocument.update).toHaveBeenCalledWith({
      where: { id: 'document-1' },
      data: expect.objectContaining({
        contentHtml: '<p>Changed</p>',
        contentText: ' Changed ',
        isPublished: false,
      }),
    });
  });

  it('publishes by replacing chunks and returning the updated document', async () => {
    prisma.knowledgeDocument.findUnique.mockResolvedValue(document);
    gemini.embedDocuments.mockResolvedValue([Array(768).fill(0.1)]);
    prisma.tx.knowledgeDocument.update.mockResolvedValue({
      ...document,
      isPublished: true,
    });

    const result = await service.publish('document-1');

    expect(vectors.replaceDocumentChunks).toHaveBeenCalledWith(
      prisma.tx,
      'document-1',
      expect.any(Array),
      expect.any(Array),
    );
    expect(result.isPublished).toBe(true);
  });

  it('unpublishes and deletes its chunks', async () => {
    prisma.knowledgeDocument.findUnique.mockResolvedValue({
      ...document,
      isPublished: true,
    });
    prisma.tx.knowledgeDocument.update.mockResolvedValue(document);

    await service.unpublish('document-1');

    expect(prisma.tx.knowledgeChunk.deleteMany).toHaveBeenCalledWith({
      where: { documentId: 'document-1' },
    });
    expect(prisma.tx.knowledgeDocument.update).toHaveBeenCalledWith({
      where: { id: 'document-1' },
      data: { isPublished: false },
    });
  });

  it('deletes a document and rejects an unknown id', async () => {
    prisma.knowledgeDocument.findUnique
      .mockResolvedValueOnce(document)
      .mockResolvedValueOnce(null);

    await expect(service.remove('document-1')).resolves.toEqual({
      id: 'document-1',
    });
    expect(prisma.knowledgeDocument.delete).toHaveBeenCalledWith({
      where: { id: 'document-1' },
    });
    await expect(service.getById('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
