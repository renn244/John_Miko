import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class GetGuestsQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    @IsEnum(['ACTIVE', 'INACTIVE'], { message: 'status must be one of ACTIVE or INACTIVE' })
    status?: 'ACTIVE' | 'INACTIVE';

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
