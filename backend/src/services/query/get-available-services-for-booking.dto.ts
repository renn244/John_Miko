import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { toDateOnly } from 'src/lib/utils/date.util';

export class GetAvailableServicesForBookingQueryDto {
    @IsNotEmpty({ message: 'bookingDate is required' })
    @Transform(({ value }) => toDateOnly(value))
    @Type(() => Date)
    @IsDate()
    bookingDate!: Date;

    @IsNotEmpty({ message: 'stayOptionId is required' })
    @IsString()
    stayOptionId!: string;
}
