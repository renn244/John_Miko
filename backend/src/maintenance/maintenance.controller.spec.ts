import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';

describe('MaintenanceController', () => {
  let controller: MaintenanceController;
  const maintenanceService = {
    getMaintenanceOverview: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceController],
      providers: [{ provide: MaintenanceService, useValue: maintenanceService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MaintenanceController>(MaintenanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates overview requests to the maintenance service', async () => {
    const date = new Date('2026-07-06T00:00:00.000Z');
    const overview = { openMaintenance: 2 };
    maintenanceService.getMaintenanceOverview.mockResolvedValue(overview);

    await expect(controller.getMaintenanceOverview({ date })).resolves.toBe(
      overview,
    );
    expect(maintenanceService.getMaintenanceOverview).toHaveBeenCalledWith(date);
  });
});
