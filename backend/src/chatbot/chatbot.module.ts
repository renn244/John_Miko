import { Module } from '@nestjs/common';
import { RagModule } from 'src/rag/rag.module';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
  imports: [RagModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
