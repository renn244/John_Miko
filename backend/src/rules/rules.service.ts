import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Rules } from 'src/generated/prisma/client';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { PrismaService } from 'src/prisma/prisma.service';
import { createRuleDto, updateRuleDto } from './dto/rules.dto';
import { GetAllRulesQuery } from './query/getAllRules.query';

@Injectable()
export class RulesService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createRule(body: createRuleDto) {
        const newRule = await this.prisma.rules.create({
            data: { ...body }
        })

        return newRule;
    }

    // async relevanceScoring()

    async interactWithChatbot(messageDto: { message: string }): Promise<Rules> {
        const rules = await this.getActiveRules();

        const quickReplyMatched = rules.find(rule => rule.name.toLowerCase() === messageDto.message.toLowerCase());

        if(quickReplyMatched) {
            return quickReplyMatched;
        }

        // make this relevance score later
        const words = messageDto.message.toLowerCase().split(/\s+/);
        const matched = rules.find(rule => rule.keywords.some(kw => words.includes(kw.toLowerCase())));

        if(!matched) {
            return { 
                id: new Date().getTime().toString(),
                keywords: [],
                name: "I Don't Understand",
                response: "I'm sorry, I don't understand that.", 
                quickReplies: ["Main Menu"],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        }

        return matched;
    }

    async getAllRules(query: GetAllRulesQuery) {
        const where: Prisma.RulesWhereInput = {
            name: { contains: query.search, mode: 'insensitive' }
        }

        const [rules, total] = await Promise.all([
            await this.prisma.rules.findMany({
                where: where,
                ...((query.page && query.limit) && getPaginationArgs(query.page, query.limit))        
            }),
            await this.prisma.rules.count({ where: where })
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

    async updateRule(id: string, body: updateRuleDto) {
        const rule = await this.getRuleById(id);

        if(!rule) {
            throw new NotFoundException('Rule not found');
        }

        const updatedRule = await this.prisma.rules.update({
            where: { id: id },
            data: { ...body }
        });

        return updatedRule;
    }

    async deleteRule(id: string) {
        const rule = await this.getRuleById(id);

        if(!rule) {
            throw new NotFoundException('Rule not found');
        }

        return this.prisma.rules.delete({
            where: { id: id }
        });
    }
}
