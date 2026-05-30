import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatbotService } from './chatbot.service';
import { DialogflowService } from './dialogflow.service';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import DIALOGFLOW_OPTIONS from './dialogo-options.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    RulesService,
    DIALOGFLOW_OPTIONS,
    DialogflowService, 
    ChatbotService],
  controllers: [RulesController]
})
export class RulesModule {}
