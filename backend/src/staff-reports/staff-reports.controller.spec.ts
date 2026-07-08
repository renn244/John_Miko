import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { StaffReportsController } from './staff-reports.controller';
import { StaffReportsService } from './staff-reports.service';

describe('StaffReportsController', () => {
  let controller: StaffReportsController;
  const staffReportsService = {
    getOverview: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffReportsController],
      providers: [{ provide: StaffReportsService, useValue: staffReportsService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<StaffReportsController>(StaffReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates overview requests to the staff reports service', async () => {
    const date = new Date('2026-07-06T00:00:00.000Z');
    const overview = { pendingReviewCount: 3 };
    staffReportsService.getOverview.mockResolvedValue(overview);

    await expect(controller.getOverview({ date })).resolves.toBe(overview);
    expect(staffReportsService.getOverview).toHaveBeenCalledWith(date);
  });
});
