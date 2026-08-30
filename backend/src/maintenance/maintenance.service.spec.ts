import { NotFoundException } from '@nestjs/common';

jest.mock('@nestjs/schedule', () => ({
  Cron: () => () => undefined,
}));

import { MaintenanceService } from './maintenance.service';

describe('MaintenanceService', () => {
  const prisma = {
    maintenance: {
      create: jest.fn(),
      findUnique: jest.fn(),
      groupBy: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
  } as any;
  const pushNotifications = {
    sendMaintenanceAssignment: jest.fn(),
  };

  let service: MaintenanceService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MaintenanceService(prisma, pushNotifications as any);
  });

  it('notifies the automatically assigned maintenance staff member', async () => {
    prisma.user.findMany.mockResolvedValue([
      { id: 'staff-1', createdAt: new Date('2026-01-01'), assignedMaintenances: [] },
    ]);
    prisma.maintenance.create.mockResolvedValue({
      id: 'maintenance-1',
      title: 'Pool pump repair',
      priority: 'High',
    });

    await service.createMaintenance({} as any, {
      title: 'Pool pump repair',
      description: 'The pump is leaking.',
      imagesUrl: [],
      priority: 'High',
      expertise: 'Pool',
    });

    expect(pushNotifications.sendMaintenanceAssignment).toHaveBeenCalledWith({
      userId: 'staff-1',
      maintenanceId: 'maintenance-1',
      title: 'Pool pump repair',
      priority: 'High',
    });
  });

  it('does not send a push notification when no staff member can be assigned', async () => {
    prisma.user.findMany.mockResolvedValue([]);
    prisma.maintenance.create.mockResolvedValue({
      id: 'maintenance-1',
      title: 'Pool pump repair',
      priority: 'High',
    });

    await service.createMaintenance({} as any, {
      title: 'Pool pump repair',
      description: 'The pump is leaking.',
      imagesUrl: [],
      priority: 'High',
      expertise: 'Pool',
    });

    expect(pushNotifications.sendMaintenanceAssignment).not.toHaveBeenCalled();
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

  it('filters active assignments before paginating', async () => {
    prisma.maintenance.findMany.mockResolvedValue([{ id: 'ticket-1' }]);
    prisma.maintenance.count.mockResolvedValue(12);

    const result = await service.getAssignedActiveMaintenances(
      { id: 'staff-1', role: 'MAINTENANCE_STAFF', email: 'staff@example.com' } as any,
      { page: 2, limit: 5, search: 'pool', status: 'Pending', priority: 'High' },
    );

    expect(prisma.maintenance.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        assignedToId: 'staff-1',
        status: 'Pending',
        priority: 'High',
      }),
      skip: 5,
      take: 5,
    }));
    expect(result).toEqual(expect.objectContaining({
      meta: expect.objectContaining({ total: 12, page: 2, limit: 5 }),
    }));
    expect(result).not.toHaveProperty('summary');
  });

  it('returns unpaginated assigned-work summary totals', async () => {
    prisma.maintenance.groupBy.mockResolvedValue([
      { status: 'Pending', _count: { status: 12 } },
    ]);
    prisma.maintenance.count.mockResolvedValue(4);

    const result = await service.getAssignedMaintenanceSummary(
      { id: 'staff-1', role: 'MAINTENANCE_STAFF', email: 'staff@example.com' } as any,
      { page: 2, limit: 5, search: 'pool', status: 'Pending', priority: 'High' },
    );

    expect(prisma.maintenance.groupBy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ assignedToId: 'staff-1', status: 'Pending', priority: 'High' }),
    }));
    expect(prisma.maintenance.count).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ assignedToId: 'staff-1', status: 'Pending', priority: 'High' }),
    }));
    expect(prisma.maintenance.findMany).not.toHaveBeenCalled();
    expect(result).toEqual({ pending: 12, inProgress: 0, highPriority: 4 });
  });

  it('reports no high-priority work when the summary is filtered to another priority', async () => {
    prisma.maintenance.groupBy.mockResolvedValue([
      { status: 'Pending', _count: { status: 3 } },
    ]);

    const result = await service.getAssignedMaintenanceSummary(
      { id: 'staff-1', role: 'MAINTENANCE_STAFF', email: 'staff@example.com' } as any,
      { priority: 'Medium' },
    );

    expect(prisma.maintenance.count).not.toHaveBeenCalled();
    expect(result).toEqual({ pending: 3, inProgress: 0, highPriority: 0 });
  });

  it('keeps history assignments scoped to completed and closed tickets', async () => {
    prisma.maintenance.findMany.mockResolvedValue([]);
    prisma.maintenance.count.mockResolvedValue(0);

    const result = await service.getAssignedMaintenanceHistory(
      { id: 'staff-1', role: 'MAINTENANCE_STAFF', email: 'staff@example.com' } as any,
      { priority: 'Medium' },
    );

    expect(prisma.maintenance.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        assignedToId: 'staff-1',
        status: { in: ['Completed', 'Closed'] },
        priority: 'Medium',
      }),
    }));
    expect(result).not.toHaveProperty('summary');
  });

  it('automatically closes tickets completed more than seven days ago', async () => {
    prisma.maintenance.updateMany.mockResolvedValue({ count: 2 });
    const now = new Date('2026-08-30T12:00:00.000Z');

    await expect(service.autoCloseCompletedTickets(now)).resolves.toEqual({ count: 2 });

    expect(prisma.maintenance.updateMany).toHaveBeenCalledWith({
      where: {
        status: 'Completed',
        resolvedAt: { lte: new Date('2026-08-23T12:00:00.000Z') },
      },
      data: {
        status: 'Closed',
        closedAt: now,
      },
    });
  });

  it('reopens a completed ticket for its assigned maintenance staff member', async () => {
    prisma.maintenance.findUnique.mockResolvedValue({
      id: 'maintenance-1',
      status: 'Completed',
      assignedToId: 'staff-1',
    });
    prisma.maintenance.update.mockResolvedValue({
      id: 'maintenance-1',
      status: 'InProgress',
      resolvedAt: null,
    });

    await expect(
      service.reopenMaintenance(
        { id: 'staff-1', role: 'MAINTENANCE_STAFF', email: 'staff@example.com' } as any,
        'maintenance-1',
      ),
    ).resolves.toEqual({
      id: 'maintenance-1',
      status: 'InProgress',
      resolvedAt: null,
    });

    expect(prisma.maintenance.update).toHaveBeenCalledWith({
      where: { id: 'maintenance-1' },
      data: { status: 'InProgress', resolvedAt: null },
    });
  });
});
