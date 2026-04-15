import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createRuleDto, updateRuleDto } from './dto/rules.dto';

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

    async getAllRules() {
        // add filter and pagination later
        const rules = await this.prisma.rules.findMany();

        return rules;
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
