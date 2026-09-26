import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { MenuItemAvailability } from 'src/generated/prisma/enums';
import { normalizeMenuCategory } from '../utils/normalizeMenuCategory';

export class GetMenuItemsQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    return normalizeMenuCategory(value) || undefined;
  })
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum([MenuItemAvailability.Unavailable, MenuItemAvailability.Available], {
    message: "Availability must be either 'Unavailable' or 'Available'",
  })
  availability?: MenuItemAvailability;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page size must be an integer number' })
  @Min(1, { message: 'Page size must be at least 1' })
  @Max(100, { message: 'Page size must be at most 100' })
  limit?: number = 10;
}
