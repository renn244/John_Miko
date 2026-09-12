import { Transform, Type } from "class-transformer";
import { PreOrderStatus } from "src/generated/prisma/client";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { toDateOnly } from "src/lib/utils/date.util";

export class GetAllPreOrdesQuery {
    @IsOptional()
    @IsEnum(['active', 'history'])
    scope?: 'active' | 'history';

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Transform(({ value }) => toDateOnly(value))
    @Type(() => Date)
    @IsDate()
    date?: string

    @IsOptional()
    @IsEnum(PreOrderStatus, {
        message: `status must be one of: ${Object.values(PreOrderStatus).join(", ")}`,
    })
    status?: PreOrderStatus;
}
