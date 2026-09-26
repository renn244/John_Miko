import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { TurnstileService } from './turnstile.service';

describe('TurnstileService', () => {
  const service = new TurnstileService();
  const previousSecret = process.env.TURNSTILE_SECRET_KEY;

  beforeEach(() => {
    process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA';
    global.fetch = jest.fn();
  });

  afterAll(() => {
    if (previousSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = previousSecret;

  });

  it('accepts a valid Turnstile response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ success: true }) });

    await expect(service.verify('turnstile-token')).resolves.toBeUndefined();
  });

  it('rejects missing or failed Turnstile responses', async () => {
    await expect(service.verify('')).rejects.toBeInstanceOf(BadRequestException);

    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ success: false }) });
    await expect(service.verify('turnstile-token')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('fails closed when verification cannot be reached', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network unavailable'));

    await expect(service.verify('turnstile-token')).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
