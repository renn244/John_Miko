import { BadRequestException } from '@nestjs/common';
import { CustomValidationPipe } from 'src/CustomValidationPipe';
import { CreateWalkInBookingDto } from './booking.dto';

describe('CreateWalkInBookingDto', () => {
  const pipe = new CustomValidationPipe();
  const body = {
    accommodationId: 'acc-1',
    name: 'Walk-in guest',
    email: 'walkin@example.com',
    contactNo: '09123456789',
    adultGuests: 1,
    kidGuests: 0,
    seniorGuests: 0,
    stayOptionId: 'stay-1',
    checkIn: new Date().toISOString(),
    addOnServices: [],
    paymentType: 'Full',
    paymentMethodId: 'cash-1',
  };

  it('rejects pre-ordered menu items', async () => {
    await expect(pipe.transform(
      { ...body, preOrderItems: [{ menuItemId: 'menu-1', quantity: 1 }] },
      { metatype: CreateWalkInBookingDto, type: 'body' },
    )).rejects.toBeInstanceOf(BadRequestException);
  });

  it('accepts a walk-in without pre-ordered menu items', async () => {
    await expect(pipe.transform(body, { metatype: CreateWalkInBookingDto, type: 'body' }))
      .resolves.toEqual(expect.objectContaining({ accommodationId: 'acc-1' }));
  });
});
