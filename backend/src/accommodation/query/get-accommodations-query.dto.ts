import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { AccommodationAvailability, AccommodationType } from "src/generated/prisma/enums";

export class GetAccommodationQueryDto {
    @IsOptional()
    @IsString({ message: 'Search must be a text string' })
    search?: string;

    @IsOptional()
    @IsEnum(AccommodationType, { message: `Type must be one of: ${Object.values(AccommodationType).join(', ')}` })
    type?: AccommodationType;

    @IsOptional()
    @IsEnum(AccommodationAvailability, { message: `Availability must be one of: ${Object.values(AccommodationAvailability).join(', ')}` })
    availability?: AccommodationAvailability;

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