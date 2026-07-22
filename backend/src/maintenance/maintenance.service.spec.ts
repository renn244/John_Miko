import { NotFoundException } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';

describe('MaintenanceService', () => {
  const prisma = {
    maintenance: {
      groupBy: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
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

  it('scopes private maintenance media reads to the assigned staff member', async () => {
    const maintenance = {
      id: 'maintenance-1',
      assignedToId: 'staff-1',
      imagesUrl: ['https://example.com/private-issue-photo'],
      resolutionProofImages: ['https://example.com/private-resolution-photo'],
    };
    prisma.maintenance.findFirst.mockResolvedValue(maintenance);

    await expect(
      service.getAssignedMaintenanceById(
        { id: 'staff-1', role: 'MAINTENANCE_STAFF', email: 'staff@example.com' } as any,
        'maintenance-1',
      ),
    ).resolves.toBe(maintenance);
    expect(prisma.maintenance.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'maintenance-1', assignedToId: 'staff-1' },
      }),
    );
  });

  it('does not return private maintenance media to unassigned staff', async () => {
    prisma.maintenance.findFirst.mockResolvedValue(null);

    await expect(
      service.getAssignedMaintenanceById(
        { id: 'staff-2', role: 'MAINTENANCE_STAFF', email: 'other@example.com' } as any,
        'maintenance-1',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
