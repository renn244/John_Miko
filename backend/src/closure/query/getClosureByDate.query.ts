import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { isNotPastDate } from "src/lib/customValidator/isNotPastDate";
import { toDateOnly } from "src/lib/utils/date.util";

export class GetClosureByDateQueryDto {
    @IsOptional()
    @IsString()
    accommodationId?: string

    @IsNotEmpty({ message: "date is required" })
    @Transform(({ value }) => toDateOnly(value))
    @Type(() => Date)
    @isNotPastDate({ message: "date cannot be in the past" })
    date!: Date
}