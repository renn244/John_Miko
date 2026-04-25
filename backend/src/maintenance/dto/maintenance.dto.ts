import { OmitType, PartialType } from "@nestjs/mapped-types";
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { MaintenancePriority } from "src/generated/prisma/enums";

export class CreateMaintenanceDto {
    @IsNotEmpty()
    @IsString()
    title!: string;

    @IsOptional()
    @ArrayMinSize(1, { message: 'At least one image URL is required' })
    @IsArray()
    @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
    imagesUrl?: string[];

    @IsNotEmpty()
    @IsString()
    @MinLength(10, { message: 'Description must be at least 10 characters long' })
    @MaxLength(400, { message: 'Description must be at most 400 characters long' })
    description!: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(MaintenancePriority, { message: 'Priority must be one of "Low", "Medium", or "High"' })
    priority!: MaintenancePriority;
}

export class UpdateMaintenanceDto extends PartialType(CreateMaintenanceDto) {}