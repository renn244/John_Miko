import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { sanitizeKnowledgeHtml } from '../content/knowledge-content';

export class CreateKnowledgeDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  category!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? sanitizeKnowledgeHtml(value) : value,
  )
  contentHtml!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100_000)
  contentText!: string;
}

export class UpdateKnowledgeDocumentDto extends PartialType(
  CreateKnowledgeDocumentDto,
) {}

export class GetKnowledgeDocumentsQuery {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  search?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;
}
