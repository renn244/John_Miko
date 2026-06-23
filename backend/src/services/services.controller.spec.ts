import { ArgumentMetadata } from '@nestjs/common';
import { CustomValidationPipe } from 'src/CustomValidationPipe';
import { UpdateServiceAvailabilityDto } from './dto/services.dto';
import { GetAvailableServicesForBookingQueryDto } from './query/get-available-services-for-booking.dto';

describe('GetAvailableServicesForBookingQueryDto', () => {
  it('transforms bookingDate query strings into Date instances', async () => {
    const pipe = new CustomValidationPipe();
    const metadata: ArgumentMetadata = {
      type: 'query',
      metatype: GetAvailableServicesForBookingQueryDto,
      data: '',
    };

    const result = await pipe.transform(
      {
        bookingDate: '2026-06-30T00:00:00.000Z',
        stayOptionId: 'stay-1',
      },
      metadata,
    );

    expect(result.bookingDate).toBeInstanceOf(Date);
    expect(result.bookingDate.toISOString()).toBe('2026-06-30T00:00:00.000Z');
    expect(result.stayOptionId).toBe('stay-1');
  });
});

describe('UpdateServiceAvailabilityDto', () => {
  it('transforms boolean availability payloads for admin updates', async () => {
    const pipe = new CustomValidationPipe();
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: UpdateServiceAvailabilityDto,
      data: '',
    };

    const result = await pipe.transform(
      {
        isActive: false,
      },
      metadata,
    );

    expect(result.isActive).toBe(false);
  });
});
