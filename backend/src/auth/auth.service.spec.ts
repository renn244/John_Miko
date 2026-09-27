import { BadRequestException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CustomValidationPipe } from '../CustomValidationPipe';
import { AuthService } from './auth.service';
import { SignInDto, SignUpGuestDto } from './dto/auth.dto';

describe('AuthService', () => {
  const pipe = new CustomValidationPipe();
  const prisma = { user: { update: jest.fn() } };
  const userService = {
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
  };
  const authSessionCache = { invalidate: jest.fn() };
  const refreshSessions = { createSession: jest.fn(), rotateSession: jest.fn(), revokeSession: jest.fn(), revokeAllForUser: jest.fn() };
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      prisma as any,
      userService as any,
      authSessionCache as any,
      refreshSessions as any,
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

  it('revokes every refresh session after a password change', async () => {
    const currentPassword = 'CurrentPassword123!';
    userService.findUserById.mockResolvedValue({
      id: 'user-1',
      password: await bcrypt.hash(currentPassword, 10),
    });
    prisma.user.update.mockResolvedValue({ id: 'user-1' });

    await expect(service.updatePassword(
      { id: 'user-1' } as any,
      { currentPassword, newPassword: 'NewPassword123!' } as any,
    )).resolves.toEqual({ message: 'Password updated successfully' });

    expect(refreshSessions.revokeAllForUser).toHaveBeenCalledWith('user-1');
  });

  describe('request validation', () => {
    const validate = (body: unknown, metatype: any) =>
      pipe.transform(body, { type: 'body', metatype });

    it.each([
      [SignInDto, { email: '  Nico@Example.COM ', password: 'password', userRole: 'GUEST', turnstileToken: 'test-token' }],
      [SignUpGuestDto, { email: '  Nico@Example.COM ', name: 'Nico', contactNo: '09171234567', password: 'ValidPassword123!', confirmPassword: 'ValidPassword123!', turnstileToken: 'test-token' }],
    ] as const)('canonicalizes email for %p', async (metatype, body) => {
      const dto = await validate(body, metatype);
      expect(dto.email).toBe('nico@example.com');
    });

    it.each(['123', 'lowercase1!', 'UPPERCASE1!', 'NoNumbers!'])('rejects weak guest signup password %s', async password => {
      await expect(validate({
        email: 'nico@example.com',
        name: 'Nico',
        contactNo: '09171234567',
        password,
        confirmPassword: password,
        turnstileToken: 'test-token',
      }, SignUpGuestDto)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('accepts a strong guest signup password', async () => {
      await expect(validate({
        email: 'nico@example.com',
        name: 'Nico',
        contactNo: '09171234567',
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
      turnstileToken: 'test-token',
      }, SignUpGuestDto)).resolves.toBeDefined();
    });
  });
});
