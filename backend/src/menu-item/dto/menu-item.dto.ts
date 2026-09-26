import { PartialType } from '@nestjs/mapped-types/dist/partial-type.helper';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';
import { MenuItemAvailability } from 'src/generated/prisma/enums';
import { normalizeMenuCategory } from '../utils/normalizeMenuCategory';

export class CreateMenuItemDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  imageUrl!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value) : value,
  )
  @IsNumber()
  price!: number;

  @Transform(({ value }) =>
    typeof value === 'string' ? normalizeMenuCategory(value) : value,
  )
  @IsNotEmpty({ message: 'Choose or create a category.' })
  @IsString()
  category!: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['Available', 'Unavailable'], {
    message: 'Availability must be either "Available" or "Unavailable"',
  })
  availability!: MenuItemAvailability;
}

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}
