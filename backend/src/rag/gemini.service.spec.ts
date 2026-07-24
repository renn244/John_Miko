import axios from 'axios';
import { GeminiService } from './gemini.service';

jest.mock('axios');

describe('GeminiService', () => {
  const config = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        GEMINI_API_KEY: 'secret',
        GEMINI_EMBEDDING_MODEL: 'gemini-embedding-2',
        GEMINI_MODEL: 'gemini-2.5-flash-lite',
      };
      return values[key];
    }),
  };
  const service = new GeminiService(config as never);

  beforeEach(() => (axios.post as jest.Mock).mockReset());

  it('creates 768-dimensional document and query embeddings', async () => {
    (axios.post as jest.Mock)
      .mockResolvedValueOnce({
        data: { embeddings: [{ values: Array(768).fill(0.25) }] },
      })
      .mockResolvedValueOnce({
        data: { embedding: { values: Array(768).fill(0.5) } },
      });

    const documents = await service.embedDocuments([
      { title: 'Pool Rules', text: 'Children need supervision.' },
    ]);
    const query = await service.embedQuery('What are the pool rules?');

    expect(documents[0]).toHaveLength(768);
    expect(query).toHaveLength(768);
  });

  it('returns only the answer after validating grounded and conversational responses', async () => {
    (axios.post as jest.Mock)
      .mockResolvedValueOnce({
        data: { candidates: [{ content: { parts: [{ text: '{"status":"answered","answer":"Use supervision.","sourceIds":["chunk-1"]}' }] } }] },
      })
      .mockResolvedValueOnce({
        data: { candidates: [{ content: { parts: [{ text: '{"status":"conversation","answer":"Hey! What can I help with?","sourceIds":[]}' }] } }] },
      });
    const evidence = [{
      id: 'chunk-1',
      type: 'document' as const,
      documentId: 'document-1',
      title: 'Rules',
      heading: null,
      text: 'Children need supervision.',
      similarity: 0.8,
    }];

    await expect(service.generateAnswer('Pool rules?', evidence)).resolves.toBe(
      'Use supervision.',
    );
    await expect(service.generateAnswer('wassup', [])).resolves.toBe(
      'Hey! What can I help with?',
    );
  });

  it('rejects an answered response without a retrieved evidence ID', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: {
        candidates: [{
          content: {
            parts: [{
              text: '{"status":"answered","answer":"Unsupported answer.","sourceIds":["missing-source"]}',
            }],
          },
        }],
      },
    });

    await expect(service.generateAnswer('Pool rules?', [])).resolves.toBeNull();
  });
});
