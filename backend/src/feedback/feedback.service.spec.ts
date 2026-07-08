import { ForbiddenException } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
  const prisma = {
    booking: { findUnique: jest.fn() },
    feedback: {
      aggregate: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  } as any;

  let service: FeedbackService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FeedbackService(prisma);
  });

  it('rejects feedback for bookings without an owning user account', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      userId: null,
    });

    await expect(
      service.createFeedback(
        { id: 'guest-1', role: 'GUEST', email: 'guest@example.com' } as any,
        { bookingId: 'booking-1', rating: 5, comment: 'Great stay' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(prisma.feedback.create).not.toHaveBeenCalled();
  });

  it('lists feedback ordered by newest first using Prisma orderBy', async () => {
    const feedbackRows = [
      { id: 'feedback-2', createdAt: new Date('2026-07-06T12:00:00.000Z') },
      { id: 'feedback-1', createdAt: new Date('2026-07-05T08:00:00.000Z') },
    ];

    prisma.feedback.findMany.mockResolvedValue(feedbackRows);
    prisma.feedback.count.mockResolvedValue(2);

    const result = await service.getFeedbacks({
      page: 1,
      limit: 10,
      search: '',
    } as any);

    expect(prisma.feedback.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' },
      }),
    );
    expect(prisma.feedback.count).toHaveBeenCalled();
    expect(result.data).toEqual(feedbackRows);
    expect(result.meta).toEqual(
      expect.objectContaining({
        total: 2,
        page: 1,
        limit: 10,
      }),
    );
  });

  it('returns feedback overview with recent and low-rating feedback', async () => {
    const recentFeedback = [{ id: 'feedback-1', rating: 5 }];
    const lowRatingFeedback = [{ id: 'feedback-2', rating: 2 }];

    prisma.feedback.aggregate.mockResolvedValue({
      _count: 2,
      _avg: { rating: 3.5 },
      _min: { rating: 2 },
      _max: { rating: 5 },
    });
    prisma.feedback.count.mockResolvedValue(1);
    prisma.feedback.findMany
      .mockResolvedValueOnce(recentFeedback)
      .mockResolvedValueOnce(lowRatingFeedback);

    const result = await service.getOverview(
      new Date('2026-07-06T00:00:00.000Z'),
    );

    expect(prisma.feedback.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: { rating: { lte: 3 } },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    );
    expect(result).toEqual({
      total: 2,
      averageRating: 3.5,
      minRating: 2,
      maxRating: 5,
      receivedToday: 1,
      recentFeedback,
      lowRatingFeedback,
    });
  });
});
