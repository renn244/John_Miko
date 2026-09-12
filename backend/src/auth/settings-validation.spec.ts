import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CustomValidationPipe } from '../CustomValidationPipe';
import { AuthService } from './auth.service';
import { UpdatePasswordDto } from './dto/changePassword.dto';
import { resetPasswordDto } from './dto/forgotPassword.dto';
import { UpdateProfileDto, UpdateProfileImageDto } from './dto/updateProfile.dto';

describe('Settings request validation and persistence', () => {
  const pipe = new CustomValidationPipe();
  const user = { id: 'qa-staff', role: 'RESORT_STAFF', email: 'qa@example.com' } as any;
  const currentPassword = 'Current123!';
  let service: AuthService;
  let saved: any;
  const prisma = { user: { update: jest.fn() } };
  const users = { findUserById: jest.fn(), findUserByEmail: jest.fn() };
  const cache = { invalidate: jest.fn() };
  const validate = (body: unknown, metatype: any) => pipe.transform(body, { type: 'body', metatype });

  beforeEach(async () => {
    jest.resetAllMocks();
    saved = { ...user, status: 'ACTIVE', password: await bcrypt.hash(currentPassword, 4) };
    users.findUserById.mockImplementation(async () => saved);
    users.findUserByEmail.mockResolvedValue(null);
    prisma.user.update.mockImplementation(async ({ data }) => Object.assign(saved, data));
    service = new AuthService(prisma as any, users as any, {} as any, cache as any);
  });

  it.each(['+639123456789', '-09123456789', '12345678.90', '09123 456789', '0912345678a', '123456789', '1234567890123456', ''])('blocks contact %j before save', async (contactNo) => {
    await expect(validate({ email: user.email, contactNo }, UpdateProfileDto).then(dto => service.updateProfile(user, dto))).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it.each(['09123456789', '1234567890', '123456789012345'])('saves accepted contact %s without removing leading zeros', async (contactNo) => {
    const dto = await validate({ email: user.email, contactNo, name: 'QA Staff' }, UpdateProfileDto);
    await service.updateProfile(user, dto);
    expect(saved.contactNo).toBe(contactNo);
    expect(cache.invalidate).toHaveBeenCalledWith(user.id);
  });

  it.each(['Ab1!', 'lowercase1!', 'UPPERCASE1!', 'NoNumbers!', 'NoSpecial123'])('blocks weak password %s in change and reset requests', async (newPassword) => {
    for (const metatype of [UpdatePasswordDto, resetPasswordDto]) {
      await expect(validate({ currentPassword, token: 'qa-token', newPassword, confirmPassword: newPassword }, metatype)).rejects.toBeInstanceOf(BadRequestException);
    }
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('rejects mismatched confirmation before saving', async () => {
    await expect(validate({ currentPassword, newPassword: 'Different123!', confirmPassword: 'Mismatch123!' }, UpdatePasswordDto)).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it.each(['Wrong123!', currentPassword])('rejects wrong current password or password reuse (%s)', async (input) => {
    const dto = await validate({ currentPassword: input, newPassword: currentPassword, confirmPassword: currentPassword }, UpdatePasswordDto);
    await expect(service.updatePassword(user, dto)).rejects.toMatchObject({ status: 400 });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('saves a strong replacement as a hash', async () => {
    const newPassword = 'Different123!';
    const dto = await validate({ currentPassword, newPassword, confirmPassword: newPassword }, UpdatePasswordDto);
    await service.updatePassword(user, dto);
    expect(saved.password).not.toBe(newPassword);
    expect(await bcrypt.compare(newPassword, saved.password)).toBe(true);
    await expect(validate({ token: 'qa-token', newPassword, confirmPassword: newPassword }, resetPasswordDto)).resolves.toBeDefined();
  });

  it('saves, replaces, and removes the profile photo', async () => {
    for (const profileImageUrl of ['https://example.com/qa-image.jpg', 'https://example.com/qa-replacement.png', null]) {
      const dto = await validate({ profileImageUrl }, UpdateProfileImageDto);
      await service.updateProfileImage(user, dto.profileImageUrl);
      expect(saved.profileImageUrl).toBe(profileImageUrl);
    }
  });

  it('rejects an invalid photo URL before save', async () => {
    await expect(validate({ profileImageUrl: 'not-an-image-url' }, UpdateProfileImageDto)).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});
