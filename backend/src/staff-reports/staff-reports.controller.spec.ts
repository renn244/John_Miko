import { Test, TestingModule } from '@nestjs/testing';
import { StaffReportsController } from './staff-reports.controller';

describe('StaffReportsController', () => {
  let controller: StaffReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffReportsController],
    }).compile();

    controller = module.get<StaffReportsController>(StaffReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
