import { IsArray, IsEnum, IsNotEmpty, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { ReportType } from "src/generated/prisma/enums";

export class CreateReportDto {
    @IsNotEmpty({ message: 'bookingId is required' })
    @IsString()
    bookingId!: string;

    @IsNotEmpty({ message: 'title is required' })
    @IsString()
    title!: string;

    @IsNotEmpty({ message: 'description is required' })
    @IsString()
    @MinLength(20, { message: 'description must be more than 20 letters' })
    @MaxLength(400, { message: 'description must be less than or equal ot 400' })
    description!: string;

    @IsArray({ message: 'proofImages must be an array' })
    @IsString({ each: true, message: 'each must be a string' })
    @IsUrl({}, { each: true, message: 'each must be a proper strings' })
    proofImages!: string[];

    @IsNotEmpty({ message: 'type is required' })
    @IsString()
    @IsEnum(ReportType, { message: 'type must be one of values (checkIn or checkOut)' })
    type!: ReportType
}