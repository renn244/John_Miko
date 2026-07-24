import { ChatbotService, LOCAL_CHATBOT_FALLBACK } from './chatbot.service';

describe('ChatbotService', () => {
  const config = { get: jest.fn().mockReturnValue('true') };

  it('returns a grounded answer without exposing its verified evidence', async () => {
    const gemini = {
      embedQuery: jest.fn().mockResolvedValue(Array(768).fill(0.1)),
      generateAnswer: jest.fn().mockResolvedValue('Children need supervision.'),
    };
    const vectors = { search: jest.fn().mockResolvedValue([{
      id: 'chunk-1',
      type: 'document',
      documentId: 'document-1',
      title: 'Pool Rules',
      heading: null,
      text: 'Children need supervision.',
      similarity: 0.8,
    }]) };
    const service = new ChatbotService(
      gemini as never,
      vectors as never,
      { search: jest.fn().mockResolvedValue([]) } as never,
      config as never,
    );

    await expect(service.answer('Pool rules?')).resolves.toEqual({
      id: expect.any(String),
      answer: 'Children need supervision.',
    });
  });

  it('passes recent context into retrieval and allows Gemini conversation without evidence', async () => {
    const gemini = {
      embedQuery: jest.fn().mockResolvedValue(Array(768).fill(0.1)),
      generateAnswer: jest.fn().mockResolvedValue("Hey! What's up?"),
    };
    const service = new ChatbotService(
      gemini as never,
      { search: jest.fn().mockResolvedValue([]) } as never,
      { search: jest.fn().mockResolvedValue([]) } as never,
      config as never,
    );
    const history = [{ role: 'user' as const, content: 'Show accommodations.' }];

    const response = await service.answer('wassup', history);

    expect(response).toEqual({
      id: expect.any(String),
      answer: "Hey! What's up?",
    });
    expect(gemini.embedQuery).toHaveBeenCalledWith('Show accommodations.\nwassup');
    expect(gemini.generateAnswer).toHaveBeenCalledWith('wassup', [], history);
  });

  it('returns Gemini insufficient answers without verified sources', async () => {
    const gemini = {
      embedQuery: jest.fn().mockResolvedValue(Array(768).fill(0.1)),
      generateAnswer: jest.fn().mockResolvedValue('I cannot verify that information.'),
    };
    const service = new ChatbotService(
      gemini as never,
      { search: jest.fn().mockResolvedValue([]) } as never,
      { search: jest.fn().mockResolvedValue([]) } as never,
      config as never,
    );

    await expect(service.answer('Helipad?')).resolves.toEqual({
      id: expect.any(String),
      answer: 'I cannot verify that information.',
    });
  });

  it('uses the fixed fallback when Gemini rejects an ungrounded answer', async () => {
    const gemini = {
      embedQuery: jest.fn().mockResolvedValue(Array(768).fill(0.1)),
      generateAnswer: jest.fn().mockResolvedValue(null),
    };
    const service = new ChatbotService(
      gemini as never,
      { search: jest.fn().mockResolvedValue([]) } as never,
      { search: jest.fn().mockResolvedValue([]) } as never,
      config as never,
    );

    await expect(service.answer('Unsupported question')).resolves.toEqual({
      id: expect.any(String),
      answer: LOCAL_CHATBOT_FALLBACK,
    });
  });

  it('uses the fixed fallback when disabled or Gemini fails', async () => {
    const disabled = new ChatbotService(
      {} as never,
      {} as never,
      {} as never,
      { get: jest.fn().mockReturnValue('false') } as never,
    );
    await expect(disabled.answer('question')).resolves.toEqual(
      expect.objectContaining({ answer: LOCAL_CHATBOT_FALLBACK }),
    );

    const failed = new ChatbotService(
      {
        embedQuery: jest.fn().mockResolvedValue(Array(768).fill(0.1)),
        generateAnswer: jest.fn().mockRejectedValue(new Error('down')),
      } as never,
      { search: jest.fn().mockResolvedValue([]) } as never,
      { search: jest.fn().mockResolvedValue([]) } as never,
      config as never,
    );
    await expect(failed.answer('question')).resolves.toEqual(
      expect.objectContaining({ answer: LOCAL_CHATBOT_FALLBACK }),
    );
  });
});
