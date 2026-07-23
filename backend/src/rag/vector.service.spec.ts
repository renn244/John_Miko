import { VectorService } from './vector.service';

describe('VectorService', () => {
  it('runs one exact published-document search', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockResolvedValue([
        {
          id: 'chunk-1',
          documentId: 'document-1',
          title: 'Pool Rules',
          heading: 'Safety',
          content: 'Children need supervision.',
          similarity: 0.82,
        },
      ]),
    };
    const config = { get: jest.fn().mockReturnValue(undefined) };
    const service = new VectorService(prisma as never, config as never);

    const result = await service.search(Array(768).fill(0.1));

    expect(result[0]).toEqual(
      expect.objectContaining({
        type: 'document',
        documentId: 'document-1',
      }),
    );
    const sql = prisma.$queryRaw.mock.calls[0][0].strings.join(' ');
    expect(sql).toContain('isPublished');
    expect(sql).toContain('documentId');
    expect(sql).toContain('<=>');
    expect(sql).not.toMatch(/hnsw|ivfflat/i);
  });
});
