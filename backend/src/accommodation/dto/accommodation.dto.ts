import { PartialType } from "@nestjs/mapped-types/dist/partial-type.helper";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { AccommodationType } from "src/generated/prisma/enums";
import { toTimeOnly } from "src/lib/utils/time.util";

class AccommodationBaseDto {
    @IsString({ message: "Name must be a string" })
    name!: string;

    @IsString({ message: "Description must be a string" })
    description!: string;

    @IsUrl({}, { message: "Invalid image URL" })
    imageUrl!: string;
    
    @IsString({ message: "Type must be a string" })
    @IsEnum(AccommodationType)
    type!: AccommodationType;

    @IsNumber({}, { message: "Capacity must be a number" })
    capacity!: number;

    @IsNumber({}, { message: "Price must be a number" })
    price!: number;

    @IsString({ each: true })
    amenities!: string[];
}

export class CreateAccommodationStayOptionDto {
    @IsString({ message: "Code must be a string" })
    code!: string;

    @IsString({ message: "Label must be a string" })
    label!: string;

    @IsNumber({}, { message: "Duration must be a number" })
    @IsOptional()
    durationHours?: number;

    @Transform(({ value }) => toTimeOnly(value))
    @IsDate({ message: "Start time must be a valid time" })
    @IsOptional()
    startTime?: Date;

    @Transform(({ value }) => toTimeOnly(value))
    @IsDate({ message: "End time must be a valid time" })
    @IsOptional()
    endTime?: Date;

    @IsNumber({}, { message: "Sort order must be a number" })
    sortOrder!: number;

    @IsBoolean({ message: "isActive must be a boolean" })
    isActive!: boolean;
}

export class CreateAccommodationDto extends AccommodationBaseDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAccommodationStayOptionDto)
    stayOptions!: CreateAccommodationStayOptionDto[];
}

export class UpdateAccommodationDto extends PartialType(AccommodationBaseDto) {
}
