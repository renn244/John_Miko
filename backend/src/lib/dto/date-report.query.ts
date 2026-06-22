import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { toDateOnly } from '../utils/date.util';

export class DateReportQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value ? toDateOnly(value) : undefined))
  @IsDate({ message: 'date must be a valid date' })
  date?: Date;
}
