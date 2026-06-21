import axios, { AxiosError } from 'axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Rules } from 'src/generated/prisma/client';
import { GEMINI_OPTIONS_KEY, GeminiOptions } from './gemini-options.provider';

type GeminiGroundedReplyParams = {
  userMessage: string;
  sessionId?: string;
  userName?: string;
  activeRules: Rules[];
  preferredRuleName?: string;
  dialogflowIntent?: string | null;
  dialogflowConfidence?: number;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
};

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);

  constructor(
    @Inject(GEMINI_OPTIONS_KEY)
    private readonly geminiOptions: GeminiOptions,
  ) {}

  isConfigured(): boolean {
    return Boolean(this.geminiOptions.apiKey);
  }

  private extractText(response: GeminiGenerateContentResponse): string {
    return (
      response.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('\n')
        .trim() || ''
    );
  }

  private parseGroundedReply(rawText: string): { matchedRuleName: string; response: string } | null {
    const normalizedText = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      const parsed = JSON.parse(normalizedText) as {
        matchedRuleName?: string;
        response?: string;
      };

      if (!parsed.matchedRuleName?.trim() || !parsed.response?.trim()) {
        return null;
      }

      return {
        matchedRuleName: parsed.matchedRuleName.trim(),
        response: parsed.response.trim(),
      };
    } catch {
      this.logger.warn(
        `Gemini returned non-JSON grounded chatbot response: ${normalizedText.slice(0, 160)}`,
      );
      return null;
    }
  }

  async generateGroundedReply({
    userMessage,
    sessionId,
    userName,
    activeRules,
    preferredRuleName,
    dialogflowIntent,
    dialogflowConfidence,
  }: GeminiGroundedReplyParams): Promise<{ matchedRuleName: string; response: string } | null> {
    if (!this.isConfigured() || activeRules.length === 0) {
      return null;
    }

    try {
      const response = await axios.post<GeminiGenerateContentResponse>(
        `${this.geminiOptions.apiUrl}/${this.geminiOptions.model}:generateContent`,
        {
          systemInstruction: {
            parts: [
              {
                text: [
                  'You are a resort booking assistant for this booking website.',
                  'Answer the user using only the provided active chatbot rules.',
                  'Choose the single best matching rule from the provided active rules.',
                  'The preferredRuleName and Dialogflow hint are only hints, not hard constraints.',
                  'If a user name is provided, you may use it naturally and only use the first name at most once when it feels appropriate.',
                  'Do not invent facts, prices, policies, accommodations, schedules, fees, or features.',
                  'Return strict JSON only in this shape: {"matchedRuleName":"exact rule name or NO_MATCH","response":"final user-facing reply"}',
                  'If no rule clearly fits, return matchedRuleName as NO_MATCH with a short polite fallback response.',
                  'answer in a way that makes you look like a real chatbot who interact with them nicely',
                ].join(' '),
              },
            ],
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: JSON.stringify({
                    userMessage,
                    sessionId,
                    userName,
                    preferredRuleName,
                    dialogflowHint: {
                      intent: dialogflowIntent,
                      confidence: dialogflowConfidence,
                    },
                    activeRules: activeRules.map((rule) => ({
                      name: rule.name,
                      keywords: rule.keywords,
                      response: rule.response,
                      quickReplies: rule.quickReplies,
                    })),
                  }),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 220,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.geminiOptions.apiKey,
          },
          timeout: 8000,
        },
      );

      const rawText = this.extractText(response.data);

      if (!rawText) {
        this.logger.warn(
          'Gemini returned no grounded chatbot response. Falling back to canonical response.',
        );
        return null;
      }

      return this.parseGroundedReply(rawText);
    } catch (error) {
      const status = (error as AxiosError)?.response?.status;
      const detail = (error as AxiosError)?.message ?? String(error);

      if (status === 429) {
        this.logger.warn(
          `Gemini rate limit reached while generating chatbot response for model ${this.geminiOptions.model}. Falling back to canonical response.`,
        );
        return null;
      }

      this.logger.warn(
        `Gemini grounded chatbot response failed for model ${this.geminiOptions.model}: ${detail}. Falling back to canonical response.`,
      );
      
      return null;
    }
  }
}
