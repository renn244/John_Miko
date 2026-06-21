import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatbotService } from './chatbot.service';
import { DialogflowService } from './dialogflow.service';
import { GeminiService } from './gemini.service';
import GEMINI_OPTIONS from './gemini-options.provider';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import DIALOGFLOW_OPTIONS from './dialogo-options.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    RulesService,
    DIALOGFLOW_OPTIONS,
    GEMINI_OPTIONS,
    DialogflowService,
    GeminiService,
    ChatbotService],
  controllers: [RulesController]
})
export class RulesModule {}
