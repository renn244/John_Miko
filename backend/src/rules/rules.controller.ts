import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { availabilityRuleDto, createRuleDto, updateRuleDto } from './dto/rules.dto';
import { RulesService } from './rules.service';

@Controller('rules')
export class RulesController {
    constructor(
        private readonly rulesService: RulesService,
    ) {}
    
    @Post()
    async createRule(@Body() createRuleDto: createRuleDto) {
        return this.rulesService.createRule(createRuleDto);
    }

    @Get()
    async getAllRules() {
        return this.rulesService.getAllRules();
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
    async updateRuleAvailability(@Param('id') id: string, @Body() availabilityRuleDto: availabilityRuleDto) {
        return this.rulesService.updateRuleAvailability(id, availabilityRuleDto.isActive);
    }

    @Patch(':id')
    async updateRule(@Param('id') id: string, @Body() updateRuleDto: updateRuleDto) {
        return this.rulesService.updateRule(id, updateRuleDto);
    }

    @Delete(':id')
    async deleteRule(@Param('id') id: string) {
        return this.rulesService.deleteRule(id);
    }
}
