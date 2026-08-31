import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('rejects a previously issued session after the account is soft deleted', async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) };
    const jwtService = { verifyAsync: jest.fn().mockResolvedValue({ id: 'staff-1' }) };
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'staff-1',
          email: 'staff@example.com',
          role: 'RESORT_STAFF',
          status: 'INACTIVE',
          deletedAt: new Date('2026-08-30'),
        }),
      },
    };
    const authSessionCache = {
      get: jest.fn().mockResolvedValue(undefined),
      set: jest.fn(),
    };
    const guard = new AuthGuard(
      reflector as any,
      jwtService as any,
      prisma as any,
      authSessionCache as any,
    );
    const request = { headers: { authorization: 'Bearer valid-token' } };
    const context = {
      getHandler: () => undefined,
      getClass: () => undefined,
      switchToHttp: () => ({ getRequest: () => request }),
    };

    await expect(guard.canActivate(context as any)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
