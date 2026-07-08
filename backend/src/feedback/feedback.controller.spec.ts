import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

describe('FeedbackController', () => {
  let controller: FeedbackController;
  const feedbackService = {
    getOverview: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [{ provide: FeedbackService, useValue: feedbackService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FeedbackController>(FeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates overview requests to the feedback service', async () => {
    const date = new Date('2026-07-06T00:00:00.000Z');
    const overview = { total: 2 };
    feedbackService.getOverview.mockResolvedValue(overview);

    await expect(controller.getOverview({ date })).resolves.toBe(overview);
    expect(feedbackService.getOverview).toHaveBeenCalledWith(date);
  });
});
