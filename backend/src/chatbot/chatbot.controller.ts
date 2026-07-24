import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Public } from 'src/lib/decorators/Public.decorator';
import { ChatbotService } from './chatbot.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Public()
  @Post('messages')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  createMessage(@Body() body: ChatMessageDto) {
    return this.chatbotService.answer(body.message.trim(), body.history ?? []);
  }
}
