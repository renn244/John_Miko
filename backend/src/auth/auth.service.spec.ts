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

  describe('request validation', () => {
    const validate = (body: unknown, metatype: any) =>
      pipe.transform(body, { type: 'body', metatype });

    it.each([
      [SignInDto, { email: '  Nico@Example.COM ', password: 'password', userRole: 'GUEST' }],
      [SignUpGuestDto, { email: '  Nico@Example.COM ', name: 'Nico', contactNo: '09171234567', password: 'ValidPassword123!', confirmPassword: 'ValidPassword123!' }],
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
      }, SignUpGuestDto)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('accepts a strong guest signup password', async () => {
      await expect(validate({
        email: 'nico@example.com',
        name: 'Nico',
        contactNo: '09171234567',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      }, SignUpGuestDto)).resolves.toBeDefined();
    });
  });
});
