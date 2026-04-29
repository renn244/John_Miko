import { Test, TestingModule } from '@nestjs/testing';
import { StaffReportsService } from './staff-reports.service';

describe('StaffReportsService', () => {
  let service: StaffReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffReportsService],
    }).compile();

    service = module.get<StaffReportsService>(StaffReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
