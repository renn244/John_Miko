import { Injectable } from '@nestjs/common';
import { Rules } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DialogflowService } from './dialogflow.service';

@Injectable()
export class ChatbotService {
    private readonly confidenceThreshold = 0.65;

    constructor(
        private readonly prisma: PrismaService,
        private readonly dialogflowService: DialogflowService,
    ) {}

    private fallbackRule(): Rules {
        return {
            id: new Date().getTime().toString(),
            keywords: [],
            name: "I Don't Understand",
            response: "I'm sorry, I don't understand that.",
            quickReplies: ['Main Menu'],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    async handleMessage(message: string): Promise<Rules> {
        const normalizedMessage = message.trim();

        if (!normalizedMessage) {
            return this.fallbackRule();
        }

        // if user clicks a quick reply that matches
        // a rule name, return it immediately.
        const directMatch = await this.prisma.rules.findFirst({
            where: {
                isActive: true,
                name: { equals: normalizedMessage, mode: 'insensitive' },
            },
        });

        if (directMatch) {
            return directMatch;
        }

        const { intent, confidence } = await this.dialogflowService.detectIntent(normalizedMessage);

        if (!intent || confidence < this.confidenceThreshold) {
            return this.fallbackRule();
        }

        const matchedRule = await this.prisma.rules.findFirst({
            where: {
                isActive: true,
                name: intent,
            },
        });

        if (!matchedRule || intent === "Default Fallback") {
            return this.fallbackRule();
        }

        return matchedRule;
    }
}