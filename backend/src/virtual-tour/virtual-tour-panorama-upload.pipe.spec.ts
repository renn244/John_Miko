import { BadRequestException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import * as sharpModule from 'sharp';
import { VirtualTourPanoramaUploadPipe } from './virtual-tour-panorama-upload.pipe';

jest.mock('fs/promises', () => ({
  unlink: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('sharp', () => jest.fn());

const sharpMock =
  (sharpModule as unknown as { default?: jest.Mock }).default ??
  (sharpModule as unknown as jest.Mock);

describe('VirtualTourPanoramaUploadPipe', () => {
  let pipe: VirtualTourPanoramaUploadPipe;
  let panorama: Express.Multer.File;
  let tiles: Express.Multer.File[];

  beforeEach(() => {
    jest.clearAllMocks();
    pipe = new VirtualTourPanoramaUploadPipe();
    panorama = {
      path: 'panorama.jpg',
      originalname: 'panorama.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;
    tiles = Array.from({ length: 32 }, (_, index) => {
      const row = Math.floor(index / 8);
      const column = index % 8;
      return {
        path: `tile-${row}-${column}.jpg`,
        originalname: `${row}_${column}.jpg`,
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
    });
    sharpMock.mockReturnValue({
      metadata: jest.fn().mockResolvedValue({
        width: 8192,
        height: 4096,
        format: 'jpeg',
      }),
    });
  });

  it('requires one original panorama', async () => {
    await expect(pipe.transform({ tiles })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(unlink).toHaveBeenCalledTimes(32);
  });

  it('requires exactly 32 slices', async () => {
    await expect(
      pipe.transform({ panorama: [panorama], tiles: tiles.slice(0, 31) }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([
    ['a duplicate slice name', { originalname: '0_0.jpg' }],
    ['an unexpected slice name', { originalname: '4_0.jpg' }],
    ['a non-JPG slice', { mimetype: 'image/png' }],
  ])('rejects %s', async (_case, override) => {
    tiles[31] = {
      ...tiles[31],
      ...override,
    } as Express.Multer.File;

    await expect(
      pipe.transform({ panorama: [panorama], tiles }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([
    [
      'an unsupported original format',
      { width: 8192, height: 4096, format: 'webp' },
    ],
    [
      'an original panorama that is not approximately 2:1',
      { width: 4096, height: 4096, format: 'jpeg' },
    ],
  ])('rejects %s', async (_case, metadata) => {
    sharpMock.mockReturnValue({
      metadata: jest.fn().mockResolvedValue(metadata),
    });

    await expect(
      pipe.transform({ panorama: [panorama], tiles }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a file that Sharp cannot read as an image', async () => {
    sharpMock.mockReturnValue({
      metadata: jest.fn().mockRejectedValue(new Error('Invalid image')),
    });

    await expect(
      pipe.transform({ panorama: [panorama], tiles }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(unlink).toHaveBeenCalledTimes(33);
  });

  it('accepts all 32 slices regardless of selection order', async () => {
    const result = await pipe.transform({
      panorama: [panorama],
      tiles: [...tiles].reverse(),
    });

    expect(result.panorama).toBe(panorama);
    expect(result.panoramaWidth).toBe(8192);
    expect(result.originalExtension).toBe('jpg');
    expect(result.tiles.some(({ filename }) => filename === '0_0.jpg')).toBe(
      true,
    );
    expect(result.tiles.some(({ filename }) => filename === '3_7.jpg')).toBe(
      true,
    );
    expect(unlink).not.toHaveBeenCalled();
  });

  it('accepts a valid PNG original', async () => {
    panorama = {
      ...panorama,
      path: 'panorama.png',
      originalname: 'panorama.png',
      mimetype: 'image/png',
    } as Express.Multer.File;
    sharpMock.mockReturnValue({
      metadata: jest.fn().mockResolvedValue({
        width: 8192,
        height: 4096,
        format: 'png',
      }),
    });

    await expect(
      pipe.transform({ panorama: [panorama], tiles }),
    ).resolves.toEqual(
      expect.objectContaining({
        panorama,
        panoramaWidth: 8192,
        originalExtension: 'png',
      }),
    );
  });
});
