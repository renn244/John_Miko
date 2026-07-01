import { StaffReportsService } from './staff-reports.service';

describe('StaffReportsService', () => {
  let service: StaffReportsService;

  beforeEach(async () => {
    service = new StaffReportsService({} as any, {} as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
