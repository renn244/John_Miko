import { UnauthorizedException } from '@nestjs/common';
import { AuthRefreshSessionService } from './auth-refresh-session.service';

describe('AuthRefreshSessionService', () => {
  const prisma = {
    authRefreshSession: {
      create: jest.fn(),
      findUnique: jest.fn(),
      updateMany: jest.fn(),
    },
    user: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  };
  const jwt = { signAsync: jest.fn() };
  const service = new AuthRefreshSessionService(prisma as any, jwt as any);
  const user = { id: 'user-1', email: 'nico@example.com', role: 'GUEST' } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    jwt.signAsync.mockResolvedValue('access-token');
    prisma.$transaction.mockImplementation((callback) => callback(prisma));
  });

  it('creates a hashed, opaque refresh session with a short-lived access token', async () => {
    prisma.authRefreshSession.create.mockResolvedValue({ id: 'session-1' });

    const result = await service.createSession(user, 'web');

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toMatch(/^session-1\.[A-Za-z0-9_-]+$/);
    expect(prisma.authRefreshSession.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        userId: user.id,
        platform: 'WEB',
        tokenHash: expect.not.stringContaining(result.refreshToken.split('.')[1]),
      }),
    }));
    expect(jwt.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({ id: user.id }),
      { expiresIn: '15m' },
    );
  });

  it('rotates a valid session and revokes the token that was presented', async () => {
    const oldToken = 'session-1.old-secret';
    prisma.authRefreshSession.findUnique.mockResolvedValue({
      id: 'session-1',
      userId: user.id,
      platform: 'WEB',
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
    });
    prisma.authRefreshSession.updateMany.mockResolvedValue({ count: 1 });
    prisma.user.findUnique.mockResolvedValue({ ...user, status: 'ACTIVE', deletedAt: null });
    prisma.authRefreshSession.create.mockResolvedValue({ id: 'session-2' });

    const result = await service.rotateSession(oldToken, 'web');

    expect(result.refreshToken).toMatch(/^session-2\./);
    expect(prisma.authRefreshSession.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ revokedAt: expect.any(Date) }),
    }));
  });

  it('rejects expired, revoked, or concurrently reused refresh sessions', async () => {
    prisma.authRefreshSession.findUnique.mockResolvedValue({
      id: 'session-1',
      userId: user.id,
      platform: 'WEB',
      expiresAt: new Date(0),
      revokedAt: null,
    });

    await expect(service.rotateSession('session-1.old-secret', 'web')).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.authRefreshSession.create).not.toHaveBeenCalled();
  });

  it('revokes every active refresh session after a password security event', async () => {
    prisma.authRefreshSession.updateMany.mockResolvedValue({ count: 2 });

    await service.revokeAllForUser(user.id);

    expect(prisma.authRefreshSession.updateMany).toHaveBeenCalledWith({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
  });
});
