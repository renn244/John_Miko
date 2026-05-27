import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { ClosureType } from "src/generated/prisma/enums";
import { isNotPastDate } from "src/lib/customValidator/isNotPastDate";
import { toDateOnly } from "src/lib/utils/date.util";

export class CreateClosureDto {
    @IsOptional()   
    @IsString()
    accommodationId?: string;

    @IsNotEmpty()
    @Transform(({ value }) => toDateOnly(value))
    @IsDate()
    @isNotPastDate()
    date!: Date;

    @IsNotEmpty()
    @IsString()
    @IsEnum(ClosureType, { message: `type must be one of the following: ${Object.values(ClosureType).join(', ')}` })
    type!: ClosureType;

    @ValidateIf(o => o.type === ClosureType.Close)
    @IsNotEmpty({ message: 'reason is required when type is Close' })
    @IsString()
    @MinLength(10)
    @MaxLength(200)
    reason!: string;
}