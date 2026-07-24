import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { CatalogSearchService } from 'src/rag/catalog-search.service';
import { GeminiService } from 'src/rag/gemini.service';
import { ConversationTurn, RagEvidence } from 'src/rag/rag.types';
import { VectorService } from 'src/rag/vector.service';

export const LOCAL_CHATBOT_FALLBACK =
  "I couldn't find that in our public resort information right now. Please contact John Miko's Place directly for assistance.";

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(
    private readonly gemini: GeminiService,
    private readonly vectors: VectorService,
    private readonly catalog: CatalogSearchService,
    private readonly config: ConfigService,
  ) {}

  async answer(message: string, history: ConversationTurn[] = []) {
    const id = randomUUID();
    if (this.config.get<string>('RAG_ENABLED') !== 'true') {
      return this.fallback(id);
    }

    try {
      const question = message.trim();
      const recentUserTurns = history
        .filter((turn) => turn.role === 'user')
        .slice(-3)
        .map((turn) => turn.content.trim())
        .filter(Boolean);

      const retrievalQuestion = [...recentUserTurns, question].join('\n');

      const [documents, catalog] = await Promise.all([
        this.gemini
          .embedQuery(retrievalQuestion)
          .then((embedding) => this.vectors.search(embedding))
          .catch((error) => {
            this.logger.warn(
              `Document retrieval unavailable: ${error instanceof Error ? error.message : String(error)}`,
            );
            return [];
          }),
        this.catalog.search(retrievalQuestion, 10).catch((error) => {
          this.logger.warn(
            `Catalog retrieval unavailable: ${error instanceof Error ? error.message : String(error)}`,
          );
          return [];
        }),
      ]);

      const evidence: RagEvidence[] = [...documents, ...catalog];
      const answer = await this.gemini.generateAnswer(
        question,
        evidence,
        history.slice(-6),
      );

      if (!answer) return this.fallback(id);
      this.logger.log(`Chatbot request ${id} completed`);

      return { id, answer };
    } catch (error) {
      this.logger.warn(
        `Chatbot request ${id} failed: ${error instanceof Error ? error.name : 'unknown error'}`,
      );

      return this.fallback(id);
    }
  }

  private fallback(id: string) {
    return { id, answer: LOCAL_CHATBOT_FALLBACK };
  }
}
