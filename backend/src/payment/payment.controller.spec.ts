import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

describe('PaymentController', () => {
  let controller: PaymentController;
  const paymentService = {
    getPaymentOverview: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [{ provide: PaymentService, useValue: paymentService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates overview requests to the payment service', async () => {
    const date = new Date('2026-07-06T00:00:00.000Z');
    const overview = { todayRevenue: 5000 };
    paymentService.getPaymentOverview.mockResolvedValue(overview);

    await expect(controller.getPaymentOverview({ date })).resolves.toBe(overview);
    expect(paymentService.getPaymentOverview).toHaveBeenCalledWith(date);
  });
});
