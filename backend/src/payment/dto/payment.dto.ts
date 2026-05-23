import { IsEnum, IsInt, IsString } from "class-validator";
import { PaymentType } from "src/generated/prisma/enums";

export class CreatePaymentDto {
    @IsString()
    bookingId!: string;

    // breakdown of the payments
    @IsInt()
    accommodationFee!: number;

    @IsInt()
    preOrderFee!: number;

    @IsInt()
    addOnServiceFee!: number;

    @IsInt()
    guestFee!: number;

    @IsInt()
    amount!: number; 

    @IsEnum(PaymentType, { message: `paymentType must be one of the following values: ${Object.values(PaymentType).join(', ')}` })
    paymentType!: PaymentType;
}