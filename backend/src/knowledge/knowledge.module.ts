import { Module } from '@nestjs/common';
import { RagModule } from 'src/rag/rag.module';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';

@Module({
  imports: [RagModule],
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
})
export class KnowledgeModule {}
