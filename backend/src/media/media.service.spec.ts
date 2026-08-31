import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Role } from 'src/generated/prisma/enums';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { MEDIA_POLICIES, MediaPurpose } from './media-policy';
import { MediaService } from './media.service';

const CONFIG: Record<string, string> = {
  CLOUDINARY_CLOUD_NAME: 'test-cloud',
  CLOUDINARY_API_KEY: 'test-key',
  CLOUDINARY_API_SECRET: 'test-secret',
  CLOUDINARY_PUBLIC_UPLOAD_PRESET: 'signed-public',
  CLOUDINARY_PRIVATE_UPLOAD_PRESET: 'signed-private',
};

const createUser = (role: Role): UserSession => ({
  id: `user-${role}`,
  email: `${role.toLowerCase()}@example.com`,
  role,
});

const allowedCases: Array<[MediaPurpose, Role]> = Object.values(
  MediaPurpose,
).flatMap((purpose) =>
  MEDIA_POLICIES[purpose].allowedRoles.map(
    (role) => [purpose, role] as [MediaPurpose, Role],
  ),
);

const rejectedCases: Array<[MediaPurpose, Role]> = Object.values(
  MediaPurpose,
).flatMap((purpose) =>
  Object.values(Role)
    .filter((role) => !MEDIA_POLICIES[purpose].allowedRoles.includes(role))
    .map((role) => [purpose, role] as [MediaPurpose, Role]),
);

describe('MediaService', () => {
  const configGet = jest.fn((key: string): string | undefined => CONFIG[key]);
  const configService = { get: configGet };
  let service: MediaService;

  beforeEach(() => {
    jest.clearAllMocks();
    cloudinary.config({
      cloud_name: CONFIG.CLOUDINARY_CLOUD_NAME,
      api_key: CONFIG.CLOUDINARY_API_KEY,
      api_secret: CONFIG.CLOUDINARY_API_SECRET,
      secure: true,
    });
    service = new MediaService(
      cloudinary,
      configService as unknown as ConfigService,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(allowedCases)('allows %s uploads for %s', (purpose, role) => {
    expect(() =>
      service.createUploadSignature(createUser(role), purpose),
    ).not.toThrow();
  });

  it.each(rejectedCases)('rejects %s uploads for %s', (purpose, role) => {
    expect(() =>
      service.createUploadSignature(createUser(role), purpose),
    ).toThrow(ForbiddenException);
  });

  it('returns a public upload signature with the configured path and preset', () => {
    const result = service.createUploadSignature(
      createUser(Role.ADMIN),
      MediaPurpose.ACCOMMODATION,
    );

    expect(result).toMatchObject({
      cloudName: 'test-cloud',
      apiKey: 'test-key',
      uploadUrl: 'https://api.cloudinary.com/v1_1/test-cloud/image/upload',
      uploadPreset: 'signed-public',
      deliveryType: 'upload',
      visibility: 'public',
    });
    expect(result.publicId).toMatch(/^public\/accommodations\/[0-9a-f-]{36}$/);
    expect(result.signature).toBeTruthy();
    expect(result.deliveryUrl).toBeUndefined();
  });

  it('returns a permanent signed URL for private media', () => {
    const result = service.createUploadSignature(
      createUser(Role.GUEST),
      MediaPurpose.PAYMENT_PROOF,
    );

    expect(result).toMatchObject({
      uploadUrl: 'https://api.cloudinary.com/v1_1/test-cloud/image/upload',
      uploadPreset: 'signed-private',
      deliveryType: 'authenticated',
      visibility: 'private',
    });
    expect(result.publicId).toMatch(/^private\/payment-proofs\/[0-9a-f-]{36}$/);
    expect(result.deliveryUrl).toContain('/image/authenticated/');
    expect(result.deliveryUrl).toContain('/s--');
  });

  it('keeps payment method QR codes publicly readable', () => {
    const result = service.createUploadSignature(
      createUser(Role.ADMIN),
      MediaPurpose.PAYMENT_METHOD_QR,
    );

    expect(result).toMatchObject({
      uploadUrl: 'https://api.cloudinary.com/v1_1/test-cloud/image/upload',
      uploadPreset: 'signed-public',
      deliveryType: 'upload',
      visibility: 'public',
    });
    expect(result.publicId).toMatch(/^public\/payment-methods\/[0-9a-f-]{36}$/);
    expect(result.deliveryUrl).toBeUndefined();
  });

  it('allows only administrators to upload public virtual tour information images', () => {
    const result = service.createUploadSignature(
      createUser(Role.ADMIN),
      MediaPurpose.VIRTUAL_TOUR_INFO,
    );

    expect(result).toMatchObject({
      deliveryType: 'upload',
      visibility: 'public',
    });
    expect(result.publicId).toMatch(
      /^public\/virtual-tour\/info\/[0-9a-f-]{36}$/,
    );
    expect(() =>
      service.createUploadSignature(
        createUser(Role.GUEST),
        MediaPurpose.VIRTUAL_TOUR_INFO,
      ),
    ).toThrow(ForbiddenException);
  });

  it('generates a unique public ID for each signature', () => {
    const user = createUser(Role.ADMIN);
    const first = service.createUploadSignature(user, MediaPurpose.MENU_ITEM);
    const second = service.createUploadSignature(user, MediaPurpose.MENU_ITEM);

    expect(first.publicId).not.toBe(second.publicId);
  });

  it('uses the standard unique public-media path for avatars', () => {
    const user = createUser(Role.GUEST);
    const result = service.createUploadSignature(user, MediaPurpose.PROFILE_AVATAR);

    expect(result).toMatchObject({
      visibility: 'public',
      deliveryType: 'upload',
    });
    expect(result.publicId).toMatch(/^public\/profile-avatars\/[0-9a-f-]{36}$/);
  });

  it('fails safely when required Cloudinary configuration is missing', () => {
    configGet.mockImplementationOnce(() => undefined);

    expect(() =>
      service.createUploadSignature(
        createUser(Role.ADMIN),
        MediaPurpose.ACCOMMODATION,
      ),
    ).toThrow(InternalServerErrorException);
  });
});
