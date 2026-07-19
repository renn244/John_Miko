import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import {
  AUTH_SESSION_CACHE_TTL_MS,
  AuthSessionCacheService,
} from './auth-session-cache.service';

@Global()
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: AUTH_SESSION_CACHE_TTL_MS,
    }),
  ],
  providers: [AuthSessionCacheService],
  exports: [AuthSessionCacheService],
})
export class AuthSessionCacheModule {}
