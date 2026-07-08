import { MaintenanceService } from './maintenance.service';

describe('MaintenanceService', () => {
  const prisma = {
    maintenance: {
      groupBy: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
  } as any;

  let service: MaintenanceService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MaintenanceService(prisma);
  });

  it('returns maintenance overview pressure and high-priority active tickets', async () => {
    const highPriorityTickets = [{ id: 'ticket-1', priority: 'High' }];

    prisma.maintenance.groupBy.mockResolvedValue([
      { status: 'Pending', _count: { status: 2 } },
      { status: 'InProgress', _count: { status: 1 } },
    ]);
    prisma.maintenance.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1);
    prisma.maintenance.findMany.mockResolvedValue(highPriorityTickets);

    const result = await service.getMaintenanceOverview(
      new Date('2026-07-06T00:00:00.000Z'),
    );

    expect(prisma.maintenance.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: { in: ['Pending', 'InProgress'] },
          priority: 'High',
        },
        take: 5,
      }),
    );
    expect(result).toEqual({
      statusCounts: {
        Pending: 2,
        InProgress: 1,
        Completed: 0,
        Closed: 0,
      },
      openMaintenance: 3,
      highPriorityOpen: 1,
      highPriorityTickets,
      today: {
        newTickets: 2,
        resolvedTickets: 1,
      },
    });
  });
});
