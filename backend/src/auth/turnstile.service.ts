import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

type TurnstileVerificationResponse = {
  success: boolean;
};

@Injectable()
export class TurnstileService {
  async verify(token: string) {
    if (!token) {
      throw new BadRequestException('Please complete the security check');
    }

    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
      throw new ServiceUnavailableException('Security check is not configured');
    }

    let result: TurnstileVerificationResponse;
    try {
      const response = await fetch(TURNSTILE_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token }),
      });

      if (!response.ok) {
        throw new Error('Turnstile verification request failed');
      }

      result = await response.json() as TurnstileVerificationResponse;
    } catch {
      throw new ServiceUnavailableException('Security check is temporarily unavailable');
    }

    if (!result.success) {
      throw new BadRequestException('Security check failed. Please try again.');
    }
  }
}
