import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AvailabilityRuleDto, CreateRuleDto, UpdateRuleDto } from './dto/rules.dto';
import { GetAllRulesQuery } from './query/getAllRules.query';
import { RulesService } from './rules.service';

@Controller('rules')
export class RulesController {
    constructor(
        private readonly rulesService: RulesService,
    ) {}
    
    @Post()
    async createRule(@Body() createRuleDto: CreateRuleDto) {
        return this.rulesService.createRule(createRuleDto);
    } 

    @Post('chatbot')
    async interactWithChatbot(@Body() messageDto: any) {
        return this.rulesService.interactWithChatbot(messageDto);
    }

    @Get()
    async getAllRules(@Query() query: GetAllRulesQuery) {
        return this.rulesService.getAllRules(query);
    }

    @Get('statistics')
    async getStatisticsRule() {
        return this.rulesService.getStatisticsRule();
    }

    @Get('active')
    async getActiveRules() {
        return this.rulesService.getActiveRules();
    }
    

    @Get(':id')
    async getRuleById(@Param('id') id: string) {
        return this.rulesService.getRuleById(id);
    }

    @Patch('availability/:id')
    async updateRuleAvailability(@Param('id') id: string, @Body() availabilityRuleDto: AvailabilityRuleDto) {
        return this.rulesService.updateRuleAvailability(id, availabilityRuleDto.isActive);
    }

    @Patch(':id')
    async updateRule(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
        return this.rulesService.updateRule(id, updateRuleDto);
    }

    @Delete(':id')
    async deleteRule(@Param('id') id: string) {
        return this.rulesService.deleteRule(id);
    }
}
