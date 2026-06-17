import { OmitType, PartialType } from "@nestjs/mapped-types";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { MaintenanceExpertise, MaintenancePriority } from "src/generated/prisma/enums";

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

    @IsNotEmpty()
    @IsString()
    @IsEnum(MaintenanceExpertise, { message: 'Expertise must be one of "Electrical", "Pool", or "Construction"' })
    expertise!: MaintenanceExpertise;
}

export class UpdateMaintenanceDto extends PartialType(CreateMaintenanceDto) {}

export class CompleteMaintenanceDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'Resolution notes must be at least 3 characters long' })
    @MaxLength(400, { message: 'Resolution notes must be at most 400 characters long' })
    resolutionNotes!: string;

    @IsArray({ message: 'resolutionProofImages must be an array' })
    @ArrayMinSize(1, { message: 'At least one proof image is required' })
    @ArrayMaxSize(3, { message: 'A maximum of three proof images is allowed' })
    @IsString({ each: true, message: 'Each proof image must be a string URL' })
    @IsUrl({}, { each: true, message: 'Each proof image must be a valid URL' })
    resolutionProofImages!: string[];
}
