import { IsEnum, IsOptional, IsString } from "class-validator";
import { MaintenancePriority, MaintenanceStatus } from "src/generated/prisma/enums";

export class GetMaintenanceDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    @IsEnum(MaintenanceStatus, { message: 'Status must be one of "Open", "Pending", "Resolved", or "Closed"' })
    status?: MaintenanceStatus;

    @IsOptional()
    @IsString()
    @IsEnum(MaintenancePriority, { message: 'Priority must be one of "Low", "Medium", or "High"' })
    priority?: MaintenancePriority;
}