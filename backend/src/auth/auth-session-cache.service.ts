import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { UserSession } from 'src/lib/decorators/User.decorator';

export const AUTH_SESSION_CACHE_TTL_MS = 15 * 60 * 1_000;

@Injectable()
export class AuthSessionCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  get(userId: string): Promise<UserSession | undefined> {
    return this.cacheManager.get<UserSession>(this.getKey(userId));
  }

  async set(user: UserSession): Promise<void> {
    await this.cacheManager.set(
      this.getKey(user.id),
      user,
      AUTH_SESSION_CACHE_TTL_MS,
    );
  }

  async invalidate(userId: string): Promise<void> {
    await this.cacheManager.del(this.getKey(userId));
  }

  private getKey(userId: string): string {
    return `auth-user:${userId}`;
  }
}
