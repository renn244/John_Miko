import { IsIn, IsOptional } from 'class-validator';
import { DateReportQueryDto } from 'src/lib/dto/date-report.query';

export class ExportReportQueryDto extends DateReportQueryDto {
  @IsOptional()
  @IsIn(['csv', 'xlsx'])
  format: 'csv' | 'xlsx' = 'csv';
}
