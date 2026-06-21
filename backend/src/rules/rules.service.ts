import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Rules } from 'src/generated/prisma/client';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatbotService } from './chatbot.service';
import { DialogflowService } from './dialogflow.service';
import { ChatbotMessageDto, CreateRuleDto, UpdateRuleDto } from './dto/rules.dto';
import { GetAllRulesQuery } from './query/getAllRules.query';

@Injectable()
export class RulesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly dialogflowService: DialogflowService,
        private readonly chatbotService: ChatbotService,
    ) {}

    private normalizeStrings(values: string[]): string[] {
        return values.map((v) => v.trim()).filter(Boolean);
    }

    private areSameStringArrays(a: string[], b: string[]): boolean {
        if (a.length !== b.length) {
            return false;
        }

        const normalizedA = [...this.normalizeStrings(a)].sort();
        const normalizedB = [...this.normalizeStrings(b)].sort();

        for (let i = 0; i < normalizedA.length; i++) {
            if (normalizedA[i] !== normalizedB[i]) {
                return false;
            }
        }

        return true;
    }

    async createRule(body: CreateRuleDto) {
        const intentName = body.intentName.trim();
        const trainingPhrases = this.normalizeStrings(body.trainingPhrases);

        await this.dialogflowService.createIntent(intentName, trainingPhrases);

        const newRule = await this.prisma.rules.create({
            data: {
                name: intentName,
                keywords: trainingPhrases,
                response: body.response,
            },
        });

        return newRule;
    }

    async interactWithChatbot(messageDto: ChatbotMessageDto): Promise<Rules> {
        return this.chatbotService.handleMessage(
            messageDto.message,
            messageDto.sessionId,
            messageDto.userName,
        );
    }

    async getAllRules(query: GetAllRulesQuery) {
        const where: Prisma.RulesWhereInput = {
            name: { contains: query.search, mode: 'insensitive' }
        }

        const [rules, total] = await Promise.all([
            this.prisma.rules.findMany({
                where: where,
                ...((query.page && query.limit) && getPaginationArgs(query.page, query.limit))        
            }),
            this.prisma.rules.count({ where: where })
        ])

        return {
            data: rules,
            meta: getPaginationMeta(total, query.page, query.limit)
        };
    }

    async getStatisticsRule() {
        const [total, grouped] = await Promise.all([
            this.prisma.rules.count(),
            this.prisma.rules.groupBy({
                by: ['isActive'],
                _count: { isActive: true },
            })
        ])

        const stats: Record<string, number> = {};
        grouped.forEach((item) => stats[item.isActive ? 'active' : 'inactive'] = item._count.isActive);
        
        return { 
            total, 
            ...stats 
        };
    }

    async getActiveRules() {
        const rules = await this.prisma.rules.findMany({
            where: { isActive: true }
        });

        return rules;
    }

    async getRuleById(id: string) {
        const rule = await this.prisma.rules.findUnique({ where: { id: id } })

        if(!rule) {
            throw new NotFoundException('Rule not found');
        }

        return rule
    }

    async updateRuleAvailability(id: string, isActive: boolean) {
        const rule = await this.getRuleById(id);

        if(!rule) {
            throw new NotFoundException('Rule not found');
        }

        const updatedRule = await this.prisma.rules.update({
            where: { id: id },
            data: { isActive: isActive }
        });

        return updatedRule;
    }

    async updateRule(id: string, body: UpdateRuleDto) {
        const rule = await this.getRuleById(id);

        if(!rule) {
            throw new NotFoundException('Rule not found');
        }

        const existingIntentName = rule.name;
        const existingTrainingPhrases = rule.keywords;

        const nextIntentName = body.intentName ? body.intentName.trim() : existingIntentName;
        const nextTrainingPhrases = body.trainingPhrases
            ? this.normalizeStrings(body.trainingPhrases)
            : existingTrainingPhrases;

        const intentChanged =
            typeof body.intentName === 'string' && nextIntentName !== existingIntentName;
        const trainingPhrasesChanged =
            Array.isArray(body.trainingPhrases) &&
            !this.areSameStringArrays(nextTrainingPhrases, existingTrainingPhrases);

        if (intentChanged) {
            await this.dialogflowService.deleteIntent(existingIntentName);
            await this.dialogflowService.createIntent(nextIntentName, nextTrainingPhrases);
        } else if (trainingPhrasesChanged) {
            await this.dialogflowService.updateIntent(existingIntentName, nextTrainingPhrases);
        }

        const updatedRule = await this.prisma.rules.update({
            where: { id: id },
            data: {
                ...(typeof body.intentName === 'string' ? { name: nextIntentName } : {}),
                ...(Array.isArray(body.trainingPhrases)
                    ? { keywords: nextTrainingPhrases }
                    : {}),
                ...(typeof body.response === 'string' ? { response: body.response } : {}),
            },
        });

        return updatedRule;
    }

    async deleteRule(id: string) {
        const rule = await this.getRuleById(id);

        if(!rule) {
            throw new NotFoundException('Rule not found');
        }

        await this.dialogflowService.deleteIntent(rule.name);

        return this.prisma.rules.delete({
            where: { id: id }
        });
    }
}
