import { StaffReportsService } from './staff-reports.service';

describe('StaffReportsService', () => {
  const prisma = {
    report: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  } as any;
  const maintenanceService = {} as any;

  let service: StaffReportsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new StaffReportsService(prisma, maintenanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns staff report overview with pending review list', async () => {
    const pendingReports = [{ id: 'report-1', status: 'Pending' }];

    prisma.report.count
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(3);
    prisma.report.findMany.mockResolvedValue(pendingReports);

    const result = await service.getOverview(
      new Date('2026-07-06T00:00:00.000Z'),
    );

    expect(prisma.report.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'Pending' },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    );
    expect(result).toEqual({
      totalToday: 4,
      checkInReportToday: 1,
      checkOutReportToday: 1,
      maintenanceReportToday: 2,
      pendingReviewCount: 3,
      pendingReports,
    });
  });
});
