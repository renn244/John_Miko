import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { toDateOnly } from "src/lib/utils/date.util";

export class GetClosureByDateQueryDto {
    @IsOptional()
    @IsString()
    accommodationId?: string

    @IsNotEmpty({ message: "date is required" })
    @Transform(({ value }) => toDateOnly(value))
    @Type(() => Date)
    date!: Date
}
