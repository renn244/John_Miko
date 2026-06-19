import { Type } from "class-transformer";
import { Role } from "src/generated/prisma/enums";
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class getStaffsQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    @IsIn([Role.KITCHEN_STAFF, Role.RESORT_STAFF, Role.MAINTENANCE_STAFF], {
        message: 'role must be one of KITCHEN_STAFF, RESORT_STAFF, or MAINTENANCE_STAFF',
    })
    role?: 'KITCHEN_STAFF' | 'RESORT_STAFF' | 'MAINTENANCE_STAFF';

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
