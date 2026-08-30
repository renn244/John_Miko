import { ConflictException } from '@nestjs/common';
import { StaffManagementService } from './staff-management.service';

describe('StaffManagementService', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    maintenance: {
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;
  const emailService = {
    sendCreatedEmail: jest.fn(),
    sendRestoredEmail: jest.fn(),
  };
  const authSessionCache = {
    invalidate: jest.fn(),
  };

  let service: StaffManagementService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation(async (callback: (transaction: unknown) => unknown) =>
      callback({ user: prisma.user, maintenance: prisma.maintenance }),
    );
    service = new StaffManagementService(
      prisma,
      emailService as any,
      authSessionCache as any,
    );
  });

  it('requires explicit restoration when a deleted staff email is reused', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'staff-1',
      role: 'RESORT_STAFF',
      deletedAt: new Date('2026-08-30'),
    });

    await expect(
      service.createStaff({
        name: 'Maria Santos',
        email: 'maria@example.com',
        contactNo: '09171234567',
        role: 'RESORT_STAFF',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('soft deletes staff and unassigns only pending and in-progress maintenance tickets', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'staff-1',
      role: 'MAINTENANCE_STAFF',
      deletedAt: null,
    });
    prisma.maintenance.updateMany.mockResolvedValue({ count: 2 });
    prisma.user.update.mockResolvedValue({ id: 'staff-1', deletedAt: new Date(), status: 'INACTIVE' });

    await service.deleteStaff('staff-1');

    expect(prisma.maintenance.updateMany).toHaveBeenCalledWith({
      where: {
        assignedToId: 'staff-1',
        status: { in: ['Pending', 'InProgress'] },
      },
      data: { assignedToId: null },
    });
    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'staff-1' },
      data: expect.objectContaining({
        status: 'INACTIVE',
        expoPushToken: null,
        deletedAt: expect.any(Date),
      }),
    }));
    expect(authSessionCache.invalidate).toHaveBeenCalledWith('staff-1');
  });

  it('finds the deleted staff record for an explicit restore flow', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: 'staff-1' });

    await expect(service.getRestoreCandidate('maria@example.com')).resolves.toEqual({ id: 'staff-1' });
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        email: 'maria@example.com',
        deletedAt: { not: null },
        role: { in: ['KITCHEN_STAFF', 'RESORT_STAFF', 'MAINTENANCE_STAFF'] },
      },
      select: { id: true },
    });
  });

  it('restores the original record with a new password and active status', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'staff-1',
      email: 'maria@example.com',
      role: 'RESORT_STAFF',
      deletedAt: new Date('2026-08-30'),
    });
    prisma.user.update.mockResolvedValue({
      id: 'staff-1',
      name: 'Maria Santos',
      email: 'maria@example.com',
      role: 'MAINTENANCE_STAFF',
      expertise: 'Electrical',
    });

    await service.restoreStaff('staff-1', {
      name: 'Maria Santos',
      email: 'maria@example.com',
      contactNo: '09171234567',
      role: 'MAINTENANCE_STAFF',
      expertise: 'Electrical',
    });

    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'staff-1' },
      data: expect.objectContaining({
        status: 'ACTIVE',
        deletedAt: null,
        expoPushToken: null,
        password: expect.any(String),
      }),
    }));
    expect(emailService.sendRestoredEmail).toHaveBeenCalledWith(expect.objectContaining({
      email: 'maria@example.com',
      temporaryPassword: expect.any(String),
    }));
    expect(authSessionCache.invalidate).toHaveBeenCalledWith('staff-1');
  });
});
