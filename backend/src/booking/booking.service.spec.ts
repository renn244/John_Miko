import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  const prisma = {
    accommodation: { findUnique: jest.fn() },
    booking: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;
  const preOrderService = { createBulkPreOrder: jest.fn() } as any;
  const bookingServicesService = { createBulk: jest.fn() } as any;
  const paymentService = {
    createPayment: jest.fn(),
    createManualPayment: jest.fn(),
    sendApprovedPaymentEmail: jest.fn(),
  } as any;
  const closureService = { validateClosureDate: jest.fn() } as any;
  const bookingEmailService = { sendSubmittedEmail: jest.fn() } as any;

  let service: BookingService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(new Date("2026-06-24T00:00:00Z").getTime());
    preOrderService.createBulkPreOrder.mockResolvedValue({ total: 450 });
    bookingServicesService.createBulk.mockResolvedValue({ total: 700 });
    service = new BookingService(
      prisma,
      preOrderService,
      bookingServicesService,
      paymentService,
      closureService,
      bookingEmailService,
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it('creates manual bookings without linking a user account', async () => {
    prisma.accommodation.findUnique.mockResolvedValue({
      id: 'acc-1',
      name: 'Villa 1',
      type: 'Room',
      price: 2000,
      imageUrl: 'https://example.com/room.jpg',
      capacity: 6,
      description: 'Ocean view',
      amenities: ['Pool'],
      isGuestFeeWaived: false,
    });

    closureService.validateClosureDate.mockResolvedValue(false);
    paymentService.createManualPayment.mockResolvedValue({
      paymentId: 'pay-1',
      referenceNumber: 'REF-1',
    });
    paymentService.sendApprovedPaymentEmail.mockResolvedValue(undefined);

    const tx = {
      accommodationStayOption: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'stay-1',
          code: 'overnight',
          label: 'Overnight',
          durationHours: 22,
          startTime: new Date("1970-01-01T14:00:00Z"),
          endTime: new Date("1970-01-01T12:00:00Z"),
        }),
      },
      booking: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(async ({ data }) => ({
          id: 'booking-1',
          ...data,
        })),
        update: jest.fn().mockImplementation(async ({ where, data }) => ({
          id: where.id,
          bookingDate: new Date('2026-06-27T00:00:00.000Z'),
          ...data,
        })),
      },
      bookedAccommodation: {
        create: jest.fn().mockResolvedValue({ id: 'snapshot-1' }),
      },
    };

    prisma.$transaction.mockImplementation(async (callback: (txArg: typeof tx) => Promise<unknown>) => callback(tx));

    const result = await service.createManualBooking(
      {
        accommodationId: 'acc-1',
        name: 'Juan Dela Cruz',
        email: 'guest@example.com',
        contactNo: '09123456789',
        adultGuests: 2,
        seniorGuests: 1,
        kidGuests: 0,
        preOrderItems: [
          { menuItemId: 'menu-1', quantity: 2 },
        ],
        addOnServices: [
          { addOnServiceId: 'addon-1', quantity: 1 },
        ],
        stayOptionId: 'stay-1',
        checkIn: new Date('2026-06-27'),
        paymentType: 'Full',
      },
      { id: 'admin-1', role: 'ADMIN', email: 'admin@example.com' } as any,
    );

    expect(tx.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: null,
          guestName: 'Juan Dela Cruz',
          email: 'guest@example.com',
          contactNo: '09123456789',
          status: 'Confirmed',
          source: 'Manual',
        }),
      }),
    );
    expect(preOrderService.createBulkPreOrder).toHaveBeenCalledWith(
      'booking-1',
      [{ menuItemId: 'menu-1', quantity: 2 }],
      tx,
    );
    expect(bookingServicesService.createBulk).toHaveBeenCalledWith(
      'booking-1',
      [{ addOnServiceId: 'addon-1', quantity: 1 }],
      tx,
    );
    expect(paymentService.createManualPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        bookingId: 'booking-1',
        preOrderFee: 450,
        addOnServiceFee: 700,
      }),
      tx,
    );
    expect(paymentService.sendApprovedPaymentEmail).toHaveBeenCalledWith('pay-1');
    expect(result).toEqual(
      expect.objectContaining({
        id: 'booking-1',
        paymentId: 'pay-1',
        referenceNumber: 'REF-1',
      }),
    );
  });

  it('throws when creating a manual booking for a missing accommodation', async () => {
    prisma.accommodation.findUnique.mockResolvedValue(null);

    await expect(
      service.createManualBooking(
        {
          accommodationId: 'missing-acc',
          name: 'Juan Dela Cruz',
          email: 'guest@example.com',
          contactNo: '09123456789',
          adultGuests: 2,
          seniorGuests: 0,
          kidGuests: 0,
          stayOptionId: 'stay-1',
          checkIn: new Date('2026-06-27'),
          paymentType: 'Partial',
        },
        { id: 'admin-1', role: 'ADMIN', email: 'admin@example.com' } as any,
      ),
  ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('requires a booking date at least three days ahead', async () => {
    await expect(
      service.createManualBooking(
        {
          accommodationId: 'acc-1',
          name: 'Juan Dela Cruz',
          email: 'guest@example.com',
          contactNo: '09123456789',
          adultGuests: 1,
          seniorGuests: 0,
          kidGuests: 0,
          stayOptionId: 'stay-1',
          checkIn: new Date('2026-06-26'),
          paymentType: 'Full',
        },
        { id: 'admin-1', role: 'ADMIN', email: 'admin@example.com' } as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('records a walk-in for today without applying the three-day rule', async () => {
    prisma.accommodation.findUnique.mockResolvedValue({
      id: 'acc-1', name: 'Villa 1', type: 'Room', price: 2000, imageUrl: '', capacity: 6,
      description: '', amenities: [], isGuestFeeWaived: false, retiredAt: null,
    });
    closureService.validateClosureDate.mockResolvedValue(false);
    paymentService.createManualPayment.mockResolvedValue({ paymentId: 'pay-1', referenceNumber: 'REF-1' });
    paymentService.sendApprovedPaymentEmail.mockResolvedValue(undefined);
    const tx = {
      accommodationStayOption: { findFirst: jest.fn().mockResolvedValue({ id: 'stay-1', code: 'daystay', label: 'Day stay', durationHours: 10 }) },
      booking: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(async ({ data }) => ({ id: 'booking-1', ...data })),
        update: jest.fn().mockImplementation(async ({ where, data }) => ({ id: where.id, bookingDate: new Date('2026-06-24T00:00:00.000Z'), ...data })),
      },
      bookedAccommodation: { create: jest.fn() },
    };
    prisma.$transaction.mockImplementation(async (callback: (txArg: typeof tx) => Promise<unknown>) => callback(tx));

    await service.createWalkInBooking({
      accommodationId: 'acc-1', name: 'Walk-in guest', email: 'walkin@example.com', contactNo: '09123456789',
      adultGuests: 1, seniorGuests: 0, kidGuests: 0, stayOptionId: 'stay-1',
      checkIn: new Date('2026-06-30'),
    }, { id: 'admin-1', role: 'ADMIN' } as any);

    expect(tx.booking.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({
      bookingDate: new Date('2026-06-24T00:00:00.000Z'), source: 'WalkIn', status: 'Confirmed',
    }) }));
    expect(paymentService.sendApprovedPaymentEmail).toHaveBeenCalledWith('pay-1');
  });

  it('returns booking overview data from booking-owned queries', async () => {
    const overviewDate = new Date('2026-07-06T00:00:00.000Z');
    const todaySchedule = [{ id: 'today-booking' }];
    const upcomingBookings = [{ id: 'upcoming-booking' }];
    const recentBookings = [{ id: 'recent-booking' }];

    prisma.booking.count.mockResolvedValue(1);
    prisma.booking.findMany
      .mockResolvedValueOnce(todaySchedule)
      .mockResolvedValueOnce(upcomingBookings)
      .mockResolvedValueOnce(recentBookings);

    const result = await service.getBookingOverview(overviewDate);

    expect(prisma.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          bookingDate: overviewDate,
          status: { not: 'Cancelled' },
        }),
      }),
    );
    expect(prisma.booking.findMany).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      todayCount: 1,
      todaySchedule,
      upcomingBookings,
      recentBookings,
    });
  });

  it('returns permanent private media URLs for a guest-owned booking', async () => {
    const booking = {
      id: 'booking-1',
      userId: 'guest-1',
      payment: {
        proofImageUrl:
          'https://res.cloudinary.com/test/image/authenticated/s--payment--/private/payment-proofs/proof',
      },
      reports: [
        {
          id: 'report-1',
          proofImages: [
            'https://res.cloudinary.com/test/image/authenticated/s--report--/private/staff-reports/proof',
          ],
        },
      ],
    };
    prisma.booking.findUnique.mockResolvedValue(booking);

    await expect(
      service.getBookingById('booking-1', {
        id: 'guest-1',
        role: 'GUEST',
        email: 'guest@example.com',
      } as any),
    ).resolves.toBe(booking);
  });

  it('denies a guest access to private media from another guest booking', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      userId: 'guest-1',
      payment: { proofImageUrl: 'https://example.com/private-proof' },
      reports: [],
    });

    await expect(
      service.getBookingById('booking-1', {
        id: 'guest-2',
        role: 'GUEST',
        email: 'other@example.com',
      } as any),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows an admin to read private media from any booking', async () => {
    const booking = {
      id: 'booking-1',
      userId: 'guest-1',
      payment: { proofImageUrl: 'https://example.com/private-proof' },
      reports: [{ id: 'report-1', proofImages: ['https://example.com/report-proof'] }],
    };
    prisma.booking.findUnique.mockResolvedValue(booking);

    await expect(
      service.getBookingById('booking-1', {
        id: 'admin-1',
        role: 'ADMIN',
        email: 'admin@example.com',
      } as any),
    ).resolves.toBe(booking);
  });
  it('returns recorded refund proof only to the booking owner or admin', async () => {
    const booking = { id: 'booking-refund', userId: 'owner', payment: { status: 'Refunded', refundReason: 'Cancelled', refundProofImageUrl: 'private-proof', refundedAt: new Date() } };
    prisma.booking.findUnique.mockResolvedValue(booking);
    await expect(service.getBookingById(booking.id, { id: 'owner', role: 'GUEST' } as any)).resolves.toEqual(booking);
    await expect(service.getBookingById(booking.id, { id: 'admin', role: 'ADMIN' } as any)).resolves.toEqual(booking);
    await expect(service.getBookingById(booking.id, { id: 'other', role: 'GUEST' } as any)).rejects.toThrow(ForbiddenException);
    expect(prisma.booking.findUnique).toHaveBeenCalledWith(expect.objectContaining({ include: expect.objectContaining({ payment: expect.objectContaining({ select: expect.objectContaining({ refundProofImageUrl: true }) }) }) }));
  });

});
