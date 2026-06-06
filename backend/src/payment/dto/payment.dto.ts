import { IsEnum, IsInt, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { PaymentType } from "src/generated/prisma/enums";

export class CreatePaymentDto {
    @IsString()
    bookingId!: string;

    @IsString()
    @IsNotEmpty()
    methodId!: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    proofImageUrl!: string;

    // breakdown of the payments
    @IsInt()
    accommodationFee!: number;

    @IsInt()
    preOrderFee!: number;

    @IsInt()
    addOnServiceFee!: number;

    @IsInt()
    guestFee!: number;

    @IsEnum(PaymentType, { message: `paymentType must be one of the following values: ${Object.values(PaymentType).join(', ')}` })
    paymentType!: PaymentType;
}

export class RejectPaymentDto {
    @IsNotEmpty({ message: 'Rejection note is required' })
    @IsString()
    rejectionNote!: string;
}