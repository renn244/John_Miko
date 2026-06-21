import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Role } from 'src/generated/prisma/enums';
import { Public } from 'src/lib/decorators/Public.decorator';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import {
  ChatbotMessageDto,
  AvailabilityRuleDto,
  CreateRuleDto,
  UpdateRuleDto,
} from './dto/rules.dto';
import { GetAllRulesQuery } from './query/getAllRules.query';
import { RulesService } from './rules.service';

@Controller('rules')
@UseGuards(AuthGuard, RolesGuard)
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Roles(Role.ADMIN)
  @Post()
  async createRule(@Body() createRuleDto: CreateRuleDto) {
    return this.rulesService.createRule(createRuleDto);
  }

  @Public()
  @Post('chatbot')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async interactWithChatbot(@Body() messageDto: ChatbotMessageDto) {
    return this.rulesService.interactWithChatbot(messageDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  async getAllRules(@Query() query: GetAllRulesQuery) {
    return this.rulesService.getAllRules(query);
  }

  @Roles(Role.ADMIN)
  @Get('statistics')
  async getStatisticsRule() {
    return this.rulesService.getStatisticsRule();
  }

  @Roles(Role.ADMIN)
  @Get('active')
  async getActiveRules() {
    return this.rulesService.getActiveRules();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async getRuleById(@Param('id') id: string) {
    return this.rulesService.getRuleById(id);
  }

  @Roles(Role.ADMIN)
  @Patch('availability/:id')
  async updateRuleAvailability(
    @Param('id') id: string,
    @Body() availabilityRuleDto: AvailabilityRuleDto,
  ) {
    return this.rulesService.updateRuleAvailability(
      id,
      availabilityRuleDto.isActive,
    );
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateRule(
    @Param('id') id: string,
    @Body() updateRuleDto: UpdateRuleDto,
  ) {
    return this.rulesService.updateRule(id, updateRuleDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteRule(@Param('id') id: string) {
    return this.rulesService.deleteRule(id);
  }
}
