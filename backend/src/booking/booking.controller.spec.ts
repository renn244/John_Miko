import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

describe('BookingController', () => {
  let controller: BookingController;
  const bookingService = {
    getBookingOverview: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [{ provide: BookingService, useValue: bookingService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BookingController>(BookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates overview requests to the booking service', async () => {
    const date = new Date('2026-07-06T00:00:00.000Z');
    const overview = { todayCount: 1 };
    bookingService.getBookingOverview.mockResolvedValue(overview);

    await expect(controller.getBookingOverview({ date })).resolves.toBe(overview);
    expect(bookingService.getBookingOverview).toHaveBeenCalledWith(date);
  });
});
