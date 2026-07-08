import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  const prisma = {
    payment: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    closure: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
    $queryRaw: jest.fn(),
  } as any;
  const paymentEmailService = {
    sendApprovedEmail: jest.fn(),
    sendRejectedEmail: jest.fn(),
  } as any;

  let service: PaymentService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PaymentService(prisma, paymentEmailService);
  });

  it('returns a date-based revenue breakdown with add-on totals', async () => {
    const reportDate = new Date('2026-06-20T00:00:00.000Z');

    prisma.payment.findMany.mockResolvedValue([
      {
        accommodationAmount: 12000,
        preOrderAmount: 1500,
        addOnAmount: 600,
        guestFeeAmount: 900,
        amountPaid: 8000,
        amountToPaid: 6400,
      },
    ]);
    prisma.closure.findMany.mockResolvedValue([
      {
        id: 'closure-1',
        accommodationId: null,
        type: 'Private',
        date: new Date(),
      },
      {
        id: 'closure-2',
        accommodationId: 'acc-1',
        type: 'Private',
        date: new Date(),
      },
      {
        id: 'closure-3',
        accommodationId: null,
        type: 'Close',
        date: new Date(),
      },
    ]);

    const result = await service.getPaymentReportBreakdown(reportDate);

    expect(result).toEqual({
      accommodationFee: 12000,
      preOrderFee: 1500,
      addOnServiceFee: 600,
      guestFee: 900,
      privateClosureRevenue: 35000,
      totalRevenue: 15000,
    });
  });

  it('adds resort-wide private closure revenue to monthly revenue analytics', async () => {
    prisma.payment.findMany.mockResolvedValue([
      {
        createdAt: new Date('2026-06-05T08:00:00.000Z'),
        totalAmount: 10000,
        accommodationAmount: 7000,
        preOrderAmount: 2000,
        addOnAmount: 0,
        guestFeeAmount: 1000,
      },
    ]);
    prisma.closure.findMany.mockResolvedValue([
      {
        id: 'closure-1',
        accommodationId: null,
        type: 'Private',
        date: new Date('2026-06-20T00:00:00.000Z'),
      },
      {
        id: 'closure-2',
        accommodationId: 'acc-1',
        type: 'Private',
        date: new Date('2026-06-22T00:00:00.000Z'),
      },
      {
        id: 'closure-3',
        accommodationId: null,
        type: 'Close',
        date: new Date('2026-06-24T00:00:00.000Z'),
      },
    ]);

    const result = await service.getRevenueAnalytics();

    expect(result).toEqual([
      {
        month: '2026-06',
        count: 2,
        totalamount: 45000,
        accommodationamount: 7000,
        preorderamount: 2000,
        addonamount: 0,
        guestfeeamount: 1000,
        privateclosurerevenueamount: 35000,
      },
    ]);
  });

  it('returns payment overview with pending reviews and today revenue', async () => {
    prisma.payment.findMany
      .mockResolvedValueOnce([
        {
          accommodationAmount: 1000,
          preOrderAmount: 200,
          addOnAmount: 300,
          guestFeeAmount: 500,
        },
      ])
      .mockResolvedValueOnce([{ id: 'payment-1', status: 'Pending' }]);
    prisma.closure.findMany.mockResolvedValue([
      {
        id: 'closure-1',
        accommodationId: null,
        type: 'Private',
        date: new Date('2026-07-06T00:00:00.000Z'),
      },
    ]);
    prisma.payment.count.mockResolvedValue(1);

    const result = await service.getPaymentOverview(
      new Date('2026-07-06T00:00:00.000Z'),
    );

    expect(prisma.payment.count).toHaveBeenCalledWith({
      where: { status: 'Pending' },
    });
    expect(result).toEqual({
      todayRevenue: 37000,
      pendingReviewCount: 1,
      pendingPayments: [{ id: 'payment-1', status: 'Pending' }],
      revenueBreakdown: {
        accommodationFee: 1000,
        preOrderFee: 200,
        addOnServiceFee: 300,
        guestFee: 500,
        privateClosureRevenue: 35000,
        totalRevenue: 37000,
      },
    });
  });
});
