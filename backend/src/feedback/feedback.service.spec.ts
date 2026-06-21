import { ForbiddenException } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
  const prisma = {
    booking: { findUnique: jest.fn() },
    feedback: { create: jest.fn() },
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
});
