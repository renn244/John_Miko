import { Module } from '@nestjs/common';
import { CatalogSearchService } from './catalog-search.service';
import { GeminiService } from './gemini.service';
import { VectorService } from './vector.service';

@Module({
  providers: [GeminiService, VectorService, CatalogSearchService],
  exports: [GeminiService, VectorService, CatalogSearchService],
})
export class RagModule {}
