import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { toDateOnly } from "src/lib/utils/date.util";

export class GetAllPreOrdesQuery {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Transform(({ value }) => toDateOnly(value))
    @Type(() => Date)
    @IsDate()
    date?: string
}