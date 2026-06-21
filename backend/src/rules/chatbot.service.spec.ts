jest.mock('uuid', () => ({
  v4: jest.fn(() => 'generated-session-id'),
}));

import { Rules } from '../generated/prisma/client';
import { ChatbotService } from './chatbot.service';
import { DialogflowService } from './dialogflow.service';
import { GeminiService } from './gemini.service';

describe('ChatbotService', () => {
  let service: ChatbotService;
  let prismaService: {
    rules: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
    };
  };
  let dialogflowService: {
    detectIntent: jest.Mock;
  };
  let geminiService: {
    generateGroundedReply: jest.Mock;
  };

  const matchedRule: Rules = {
    id: 'rule-1',
    name: 'Accommodation Pricing',
    keywords: ['accommodation price'],
    response: 'Prices start at...',
    quickReplies: ['Corkage Fees'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const corkageRule: Rules = {
    id: 'rule-2',
    name: 'Corkage Policy',
    keywords: ['corkage fee', 'outside food', 'outside drinks'],
    response: 'Outside food and drinks are allowed with corkage fees.',
    quickReplies: ['Payment Methods'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    prismaService = {
      rules: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    };

    dialogflowService = {
      detectIntent: jest.fn(),
    };

    geminiService = {
      generateGroundedReply: jest.fn(),
    };

    service = new ChatbotService(
      prismaService as never,
      dialogflowService as unknown as DialogflowService,
      geminiService as unknown as GeminiService,
    );
  });

  it('passes sessionId to Dialogflow when resolving intents', async () => {
    prismaService.rules.findMany.mockResolvedValue([matchedRule]);
    prismaService.rules.findFirst.mockResolvedValueOnce(null);
    dialogflowService.detectIntent.mockResolvedValue({
      intent: 'Accommodation Pricing',
      confidence: 0.91,
    });
    geminiService.generateGroundedReply.mockResolvedValue({
      matchedRuleName: 'Accommodation Pricing',
      response: 'Prices start at...',
    });

    const result = await service.handleMessage(
      'How much is the price for accommodations?',
      'session-abc',
      'Mika',
    );

    expect(dialogflowService.detectIntent).toHaveBeenCalledWith(
      'How much is the price for accommodations?',
      'session-abc',
    );
    expect(result.name).toBe(matchedRule.name);
  });

  it('uses Gemini as the grounded response layer when available', async () => {
    prismaService.rules.findMany.mockResolvedValue([matchedRule]);
    prismaService.rules.findFirst.mockResolvedValueOnce(null);
    dialogflowService.detectIntent.mockResolvedValue({
      intent: 'Accommodation Pricing',
      confidence: 0.91,
    });
    geminiService.generateGroundedReply.mockResolvedValue({
      matchedRuleName: 'Accommodation Pricing',
      response: 'We offer several accommodations, and pricing depends on the unit you choose.',
    });

    const result = await service.handleMessage(
      'How much is the price for accommodations?',
      'session-abc',
      'Mika',
    );

    expect(geminiService.generateGroundedReply).toHaveBeenCalledWith({
      userMessage: 'How much is the price for accommodations?',
      sessionId: 'session-abc',
      userName: 'Mika',
      activeRules: [matchedRule],
      preferredRuleName: 'Accommodation Pricing',
      dialogflowIntent: 'Accommodation Pricing',
      dialogflowConfidence: 0.91,
    });
    expect(result.response).toBe(
      'We offer several accommodations, and pricing depends on the unit you choose.',
    );
    expect(result.quickReplies).toEqual(matchedRule.quickReplies);
  });

  it('falls back to the Dialogflow matched canonical rule when Gemini returns null', async () => {
    prismaService.rules.findMany.mockResolvedValue([matchedRule]);
    prismaService.rules.findFirst.mockResolvedValueOnce(null);
    dialogflowService.detectIntent.mockResolvedValue({
      intent: 'Accommodation Pricing',
      confidence: 0.91,
    });
    geminiService.generateGroundedReply.mockResolvedValue(null);

    const result = await service.handleMessage(
      'How much is the price for accommodations?',
      'session-abc',
      'Mika',
    );

    expect(result).toEqual(matchedRule);
  });

  it('returns Gemini fallback response when no active rule clearly fits', async () => {
    prismaService.rules.findMany.mockResolvedValue([matchedRule]);
    prismaService.rules.findFirst.mockResolvedValueOnce(null);
    dialogflowService.detectIntent.mockResolvedValue({
      intent: null,
      confidence: 0.2,
    });
    geminiService.generateGroundedReply.mockResolvedValue({
      matchedRuleName: 'NO_MATCH',
      response: 'Sorry Mika, I could not find a matching resort answer for that yet.',
    });

    const result = await service.handleMessage(
      'asdkjahsdkjashd',
      'session-fallback',
      'Mika',
    );

    expect(result.name).toBe("I Don't Understand");
    expect(result.response).toBe('Sorry Mika, I could not find a matching resort answer for that yet.');
  });

  it('does not let low Dialogflow confidence block Gemini from answering with a stored rule', async () => {
    prismaService.rules.findMany.mockResolvedValue([matchedRule]);
    prismaService.rules.findFirst.mockResolvedValueOnce(null);
    dialogflowService.detectIntent.mockResolvedValue({
      intent: 'Accommodation Pricing',
      confidence: 0.24,
    });
    geminiService.generateGroundedReply.mockResolvedValue({
      matchedRuleName: 'Accommodation Pricing',
      response: 'Hi Mika, we offer several accommodations, and pricing depends on the unit you choose.',
    });

    const result = await service.handleMessage(
      'how much are your available rooms and cottages?',
      'session-low-confidence',
      'Mika',
    );

    expect(geminiService.generateGroundedReply).toHaveBeenCalledWith({
      userMessage: 'how much are your available rooms and cottages?',
      sessionId: 'session-low-confidence',
      userName: 'Mika',
      activeRules: [matchedRule],
      preferredRuleName: 'Accommodation Pricing',
      dialogflowIntent: 'Accommodation Pricing',
      dialogflowConfidence: 0.24,
    });
    expect(result.name).toBe('Accommodation Pricing');
    expect(result.response).toBe(
      'Hi Mika, we offer several accommodations, and pricing depends on the unit you choose.',
    );
  });

  it('uses direct rule hits as a preferred hint without needing Dialogflow first', async () => {
    prismaService.rules.findMany.mockResolvedValue([matchedRule]);
    prismaService.rules.findFirst.mockResolvedValueOnce(matchedRule);
    geminiService.generateGroundedReply.mockResolvedValue({
      matchedRuleName: 'Accommodation Pricing',
      response: 'Hi Mika, here are the accommodation pricing details.',
    });

    const result = await service.handleMessage(
      'Accommodation Pricing',
      'session-direct',
      'Mika',
    );

    expect(dialogflowService.detectIntent).not.toHaveBeenCalled();
    expect(geminiService.generateGroundedReply).toHaveBeenCalledWith({
      userMessage: 'Accommodation Pricing',
      sessionId: 'session-direct',
      userName: 'Mika',
      activeRules: [matchedRule],
      preferredRuleName: 'Accommodation Pricing',
      dialogflowIntent: undefined,
      dialogflowConfidence: undefined,
    });
    expect(result.response).toBe('Hi Mika, here are the accommodation pricing details.');
  });

  it('falls back to heuristic keyword matching before using the generic fallback', async () => {
    prismaService.rules.findMany.mockResolvedValue([matchedRule, corkageRule]);
    prismaService.rules.findFirst.mockResolvedValueOnce(null);
    dialogflowService.detectIntent.mockResolvedValue({
      intent: null,
      confidence: 0.11,
    });
    geminiService.generateGroundedReply.mockResolvedValue(null);

    const result = await service.handleMessage(
      'how much is your corkage fee for outside food?',
      'session-heuristic',
      'Mika',
    );

    expect(result.name).toBe('Corkage Policy');
    expect(result.response).toBe('Outside food and drinks are allowed with corkage fees.');
  });

  it('keeps Gemini fallback text even when the matched rule name is unknown', async () => {
    prismaService.rules.findMany.mockResolvedValue([matchedRule]);
    prismaService.rules.findFirst.mockResolvedValueOnce(null);
    dialogflowService.detectIntent.mockResolvedValue({
      intent: null,
      confidence: 0.12,
    });
    geminiService.generateGroundedReply.mockResolvedValue({
      matchedRuleName: 'Some Unknown Rule',
      response: 'Hi Mika, I can still help with general booking questions even if that exact rule was not found.',
    });

    const result = await service.handleMessage(
      'help me with something general',
      'session-unknown-rule',
      'Mika',
    );

    expect(result.name).toBe("I Don't Understand");
    expect(result.response).toBe(
      'Hi Mika, I can still help with general booking questions even if that exact rule was not found.',
    );
  });

  it('treats Dialogflow Default Fallback as a signal to use Gemini or heuristic fallback instead', async () => {
    prismaService.rules.findMany.mockResolvedValue([matchedRule, corkageRule]);
    prismaService.rules.findFirst.mockResolvedValueOnce(null);
    dialogflowService.detectIntent.mockResolvedValue({
      intent: 'Default Fallback',
      confidence: 0.01,
    });
    geminiService.generateGroundedReply.mockResolvedValue({
      matchedRuleName: 'Corkage Policy',
      response: 'Hi Mika, outside food and drinks are allowed with corkage fees.',
    });

    const result = await service.handleMessage(
      'can i bring outside food?',
      'session-default-fallback',
      'Mika',
    );

    expect(geminiService.generateGroundedReply).toHaveBeenCalledWith({
      userMessage: 'can i bring outside food?',
      sessionId: 'session-default-fallback',
      userName: 'Mika',
      activeRules: [matchedRule, corkageRule],
      preferredRuleName: undefined,
      dialogflowIntent: undefined,
      dialogflowConfidence: undefined,
    });
    expect(result.name).toBe('Corkage Policy');
  });
});
