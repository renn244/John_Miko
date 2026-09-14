import * as bcrypt from 'bcrypt';
import { CustomValidationPipe } from '../CustomValidationPipe';
import { ForgotPasswordService } from './forgotPassword.service';
import { forgotPasswordDto, resendForgotPasswordDto } from './dto/forgotPassword.dto';

jest.mock('uuid', () => ({ v4: () => 'qa-reset-token' }));

describe('Password reset destinations and tokens', () => {
  const prisma = {
    passwordResetToken: { deleteMany: jest.fn(), create: jest.fn(), findFirst: jest.fn() },
    user: { update: jest.fn() },
  };
  const email = { sendEmail: jest.fn() };
  const users = { findUserByEmail: jest.fn(), isMobileUserByRole: jest.fn() };
  const service = new ForgotPasswordService(prisma as any, email as any, users as any);
  const pipe = new CustomValidationPipe();
  const keys = ['FRONTEND_URL', 'MOBILE_URL', 'PASSWORD_RESET_BRIDGE_URL'] as const;
  const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.FRONTEND_URL = 'https://resort.example/';
    process.env.MOBILE_URL = 'jmport://';
    process.env.PASSWORD_RESET_BRIDGE_URL = 'https://api.resort.example/';
    users.isMobileUserByRole.mockImplementation(role => ['KITCHEN_STAFF', 'RESORT_STAFF', 'MAINTENANCE_STAFF'].includes(role));
  });
  afterAll(() => {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });

  describe.each(['forgetPassword', 'resendForgotPassword'] as const)('%s', method => {
    it.each(['KITCHEN_STAFF', 'RESORT_STAFF', 'MAINTENANCE_STAFF', 'ADMIN', 'GUEST'])('honors web/mobile and preserves legacy routing for %s', async role => {
      users.findUserByEmail.mockResolvedValue({ id: 'user', role, email: 'qa@example.com' });
      for (const platform of ['web', 'mobile', undefined] as const) {
        await service[method]('qa@example.com', platform);
        const mobile = platform === 'mobile' || (!platform && role.endsWith('_STAFF'));
        expect(email.sendEmail).toHaveBeenLastCalledWith(expect.objectContaining({
          context: expect.objectContaining({ confirmationUrl: mobile
            ? 'https://api.resort.example/auth/reset-password/open?token=qa-reset-token'
            : 'https://resort.example/reset-password?token=qa-reset-token' }),
        }));
      }
      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user' } });
    });

    it('keeps unknown-account responses generic without sending email', async () => {
      users.findUserByEmail.mockResolvedValue(null);
      await expect(service[method]('missing@example.com', 'web')).resolves.toEqual({ message: 'If an account exists, we sent reset instructions' });
      expect(email.sendEmail).not.toHaveBeenCalled();
    });
  });

  it.each([forgotPasswordDto, resendForgotPasswordDto])('validates the platform enum on %p', async metatype => {
    for (const platform of ['web', 'mobile', undefined]) {
      await expect(pipe.transform({ email: 'qa@example.com', platform }, { type: 'body', metatype })).resolves.toBeDefined();
    }
    for (const platform of ['https://attacker.example', '', 'desktop', 1]) {
      await expect(pipe.transform({ email: 'qa@example.com', platform }, { type: 'body', metatype })).rejects.toThrow();
    }
  });

  it('preserves the app scheme and encodes bridge tokens', () => {
    expect(service.buildMobileResetUrl('a&b')).toBe('jmport://reset-password?token=a%26b');
  });

  it('rejects missing and expired tokens before updating a password', async () => {
    prisma.passwordResetToken.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({ expiresAt: new Date(0) });
    const body = { token: 'invalid', newPassword: 'NewPassword123!', confirmPassword: 'NewPassword123!' };
    await expect(service.resetPassword(body)).rejects.toThrow('Invalid Token');
    await expect(service.resetPassword(body)).rejects.toThrow('Token has expired');
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('hashes a valid reset and consumes the token so it cannot be reused', async () => {
    prisma.passwordResetToken.findFirst.mockResolvedValueOnce({ userId: 'user', expiresAt: new Date(Date.now() + 60000) }).mockResolvedValueOnce(null);
    const body = { token: 'valid', newPassword: 'NewPassword123!', confirmPassword: 'NewPassword123!' };
    await expect(service.resetPassword(body)).resolves.toEqual({ message: 'Password changed successfully' });
    const saved = prisma.user.update.mock.calls[0][0];
    expect(await bcrypt.compare(body.newPassword, saved.data.password)).toBe(true);
    expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user' } });
    await expect(service.resetPassword(body)).rejects.toThrow('Invalid Token');
    expect(prisma.user.update).toHaveBeenCalledTimes(1);
  });
});
