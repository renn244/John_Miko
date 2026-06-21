import { Injectable } from '@nestjs/common';
import { Rules } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DialogflowService } from './dialogflow.service';
import { GeminiService } from './gemini.service';

@Injectable()
export class ChatbotService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly dialogflowService: DialogflowService,
        private readonly geminiService: GeminiService,
    ) {}

    private fallbackRule(): Rules {
        return {
            id: new Date().getTime().toString(),
            keywords: [],
            name: "I Don't Understand",
            response: "I'm sorry, I'm not able to understand that, you can message our facebook page for further assistance: https://www.facebook.com/JohnMiko's",
            quickReplies: ['Main Menu'],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    private normalizeMessage(value: string): string {
        return value.trim();
    }

    private tokenize(value: string): string[] {
        return value
            .toLowerCase()
            .split(/[^a-z0-9]+/i)
            .filter((token) => token.length >= 3);
    }

    private async getActiveRules(): Promise<Rules[]> {
        return this.prisma.rules.findMany({
            where: { isActive: true },
        });
    }

    private async getDirectMatch(message: string): Promise<Rules | null> {
        return this.prisma.rules.findFirst({
            where: {
                isActive: true,
                name: { equals: message, mode: 'insensitive' },
            },
        });
    }

    private findHeuristicRule(activeRules: Rules[], userMessage: string): Rules | null {
        const normalizedMessage = userMessage.trim().toLowerCase();
        const messageTokens = new Set(this.tokenize(userMessage));

        let bestRule: Rules | null = null;
        let bestScore = 0;

        for (const rule of activeRules) {
            let score = 0;
            const ruleName = rule.name.toLowerCase();

            if (normalizedMessage.includes(ruleName)) {
                score += 8;
            }

            for (const keyword of rule.keywords) {
                const normalizedKeyword = keyword.trim().toLowerCase();

                if (!normalizedKeyword) {
                    continue;
                }

                if (normalizedMessage.includes(normalizedKeyword)) {
                    score += 5;
                }

                const keywordTokens = this.tokenize(normalizedKeyword);

                for (const token of keywordTokens) {
                    if (messageTokens.has(token)) {
                        score += 1;
                    }
                }
            }

            const ruleNameTokens = this.tokenize(rule.name);

            for (const token of ruleNameTokens) {
                if (messageTokens.has(token)) {
                    score += 2;
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestRule = rule;
            }
        }

        return bestScore >= 3 ? bestRule : null;
    }

    async handleMessage(message: string, sessionId?: string, userName?: string): Promise<Rules> {
        const normalizedMessage = this.normalizeMessage(message);

        if (!normalizedMessage) {
            return this.fallbackRule();
        }

        const activeRules = await this.getActiveRules();
        const directMatch = await this.getDirectMatch(normalizedMessage);

        if (directMatch) {
            return (
                await this.withGroundedReply(
                    activeRules,
                    normalizedMessage,
                    sessionId,
                    userName,
                    directMatch.name,
                )
            ) ?? directMatch;
        }

        const { intent, confidence } = await this.dialogflowService.detectIntent(normalizedMessage, sessionId);
        
        const preferredRule = intent && intent !== 'Default Fallback'
            ? activeRules.find((rule) => rule.name === intent) ?? null
            : null;

        const groundedReply = await this.withGroundedReply(
            activeRules,
            normalizedMessage,
            sessionId,
            userName,
            intent === 'Default Fallback' ? undefined : preferredRule?.name,
            intent === 'Default Fallback' ? undefined : intent,
            intent === 'Default Fallback' ? undefined : confidence,
        );

        if (groundedReply) {
            return groundedReply;
        }

        if (preferredRule) {
            return preferredRule;
        }

        return this.findHeuristicRule(activeRules, normalizedMessage) ?? this.fallbackRule();
    }

    private async withGroundedReply(
        activeRules: Rules[],
        userMessage: string,
        sessionId?: string,
        userName?: string,
        preferredRuleName?: string,
        dialogflowIntent?: string | null,
        dialogflowConfidence?: number,
    ): Promise<Rules | null> {
        const groundedReply = await this.geminiService.generateGroundedReply({
            userMessage,
            sessionId,
            userName,
            activeRules,
            preferredRuleName,
            dialogflowIntent,
            dialogflowConfidence,
        });

        if (!groundedReply) {
            return null;
        }

        if (groundedReply.matchedRuleName === 'NO_MATCH') {
            return {
                ...this.fallbackRule(),
                response: groundedReply.response,
            };
        }

        const matchedRule = activeRules.find(
            (rule) => rule.name.toLowerCase() === groundedReply.matchedRuleName.toLowerCase(),
        );

        if (!matchedRule) {
            return {
                ...this.fallbackRule(),
                response: groundedReply.response,
            };
        }

        return {
            ...matchedRule,
            response: groundedReply.response,
        };
    }
}
