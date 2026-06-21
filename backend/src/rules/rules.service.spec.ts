jest.mock('uuid', () => ({
  v4: jest.fn(() => 'generated-session-id'),
}));

import { Rules } from '../generated/prisma/client';
import { ChatbotService } from './chatbot.service';
import { RulesService } from './rules.service';

describe('RulesService', () => {
  let service: RulesService;
  let chatbotService: { handleMessage: jest.Mock };

  const ruleResponse: Rules = {
    id: 'rule-1',
    name: 'Accommodation Pricing',
    keywords: [],
    response: 'Prices start at...',
    quickReplies: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    chatbotService = {
      handleMessage: jest.fn(),
    };

    service = new RulesService(
      {} as never,
      {} as never,
      chatbotService as unknown as ChatbotService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('passes the chatbot sessionId through to ChatbotService', async () => {
    chatbotService.handleMessage.mockResolvedValue(ruleResponse);

    const result = await service.interactWithChatbot({
      message: 'How much is the price for accommodations?',
      sessionId: 'session-123',
      userName: 'Mika',
    });

    expect(chatbotService.handleMessage).toHaveBeenCalledWith(
      'How much is the price for accommodations?',
      'session-123',
      'Mika',
    );
    expect(result).toBe(ruleResponse);
  });
});
