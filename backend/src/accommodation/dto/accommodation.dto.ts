import { PartialType } from "@nestjs/mapped-types/dist/partial-type.helper";
import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";
import { AccommodationAvailability, AccommodationType } from "src/generated/prisma/enums";

export class CreateAccommodationDto {
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

    @IsString({ message: "Availability must be a string" })
    @IsEnum(AccommodationAvailability)
    availability!: AccommodationAvailability;
}

export class UpdateAccommodationDto extends PartialType(CreateAccommodationDto) {
}