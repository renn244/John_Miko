import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaymentMethodType } from 'src/generated/prisma/enums';

export class GetPaymentMethodsQuery {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(PaymentMethodType, {
        message: `type must be one of the following values: ${Object.values(PaymentMethodType).join(', ')}`
    })
    type?: PaymentMethodType;

    @IsOptional()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page must be an integer number' })
    @Min(1, { message: 'Page must be at least 1' })
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page size must be an integer number' })
    @Min(1, { message: 'Page size must be at least 1' })
    @Max(100, { message: 'Page size must be at most 100' })
    limit: number = 10;
}
