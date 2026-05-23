import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class GetServicesQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page must be an integer number' })
    @Min(1, { message: 'Page must be at least 1' })
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page size must be an integer number' })
    @Min(1, { message: 'Page size must be at least 1' })
    @Max(100, { message: 'Page size must be at most 100' })
    limit: number = 10;
}