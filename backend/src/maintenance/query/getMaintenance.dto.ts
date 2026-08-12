import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { MaintenancePriority, MaintenanceStatus } from "src/generated/prisma/enums";

export class GetMaintenanceDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    @IsEnum(MaintenanceStatus, { message: 'Status must be one of "Pending", "InProgress", "Completed", or "Closed"' })
    status?: MaintenanceStatus;

    @IsOptional()
    @IsString()
    @IsEnum(MaintenancePriority, { message: 'Priority must be one of "Low", "Medium", or "High"' })
    priority?: MaintenancePriority;

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
