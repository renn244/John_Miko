import { ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const prisma = { user: { update: jest.fn() } };
  const userService = {
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
  };
  const jwtService = { signAsync: jest.fn() };
  const authSessionCache = { invalidate: jest.fn() };
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      prisma as any,
      userService as any,
      jwtService as any,
      authSessionCache as any,
    );
  });

  it('does not allow a deleted staff account to sign in', async () => {
    userService.findUserByEmail.mockResolvedValue({
      id: 'staff-1',
      email: 'staff@example.com',
      password: await bcrypt.hash('password', 10),
      role: 'RESORT_STAFF',
      status: 'INACTIVE',
      deletedAt: new Date('2026-08-30'),
    });

    await expect(
      service.SignIn('staff@example.com', 'password', 'RESORT_STAFF'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
