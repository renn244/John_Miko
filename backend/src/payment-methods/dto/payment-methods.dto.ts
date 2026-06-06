import { PartialType } from '@nestjs/mapped-types/dist/partial-type.helper';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { PaymentMethodType } from 'src/generated/prisma/enums';

export class CreatePaymentMethodDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsEnum(PaymentMethodType, {
        message: `type must be one of the following values: ${Object.values(PaymentMethodType).join(', ')}`
    })
    type!: PaymentMethodType;

    @IsOptional()
    @IsString()
    accountName?: string;

    @IsOptional()
    @IsString()
    accountNumber?: string;

    @IsOptional()
    @IsString()
    instructions?: string;

    @IsOptional()
    @IsUrl()
    qrCodeUrl?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    sortOrder?: number;

    @IsOptional()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive?: boolean;
}

export class UpdatePaymentMethodDto extends PartialType(CreatePaymentMethodDto) {}

export class UpdatePaymentMethodAvailabilityDto {
    @IsNotEmpty({ message: 'isActive is required' })
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive!: boolean;
}
