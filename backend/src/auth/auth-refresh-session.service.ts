import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
import { type Response } from 'express';
import { AuthSessionPlatform, Prisma, User, UserStatus } from 'src/generated/prisma/client';
import { getAllowedFrontendOrigins } from 'src/config/origins';
import { PrismaService } from 'src/prisma/prisma.service';

export const REFRESH_COOKIE_NAME = 'jmport_refresh';
export type AuthClientPlatform = 'web' | 'mobile';

export type AuthSessionTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};

const ACCESS_TOKEN_TTL = '15m';
const DEFAULT_REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const REMEMBER_ME_REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthRefreshSessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createSession(
    user: Pick<User, 'id' | 'email' | 'role'>,
    platform: AuthClientPlatform,
    rememberMe = false,
  ): Promise<AuthSessionTokens> {
    const expiresAt = new Date(
      Date.now() + (rememberMe ? REMEMBER_ME_REFRESH_TTL_MS : DEFAULT_REFRESH_TTL_MS),
    );
    const refreshToken = await this.createRefreshToken(user.id, platform, expiresAt);

    return {
      accessToken: await this.createAccessToken(user),
      refreshToken,
      expiresAt,
    };
  }

  async rotateSession(
    refreshToken: string,
    platform: AuthClientPlatform,
  ): Promise<AuthSessionTokens> {
    const { sessionId, secret } = this.parseRefreshToken(refreshToken);
    const tokenHash = this.hashSecret(secret);
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      const session = await tx.authRefreshSession.findUnique({
        where: { id: sessionId },
      });

      if (
        !session ||
        session.platform !== this.toPrismaPlatform(platform) ||
        session.expiresAt <= now ||
        session.revokedAt
      ) {
        throw new UnauthorizedException('Refresh session is no longer valid');
      }

      const revoked = await tx.authRefreshSession.updateMany({
        where: {
          id: session.id,
          tokenHash,
          revokedAt: null,
          expiresAt: { gt: now },
        },
        data: { revokedAt: now, lastUsedAt: now },
      });

      if (revoked.count !== 1) {
        throw new UnauthorizedException('Refresh session is no longer valid');
      }

      const user = await tx.user.findUnique({
        where: { id: session.userId },
        select: { id: true, email: true, role: true, status: true, deletedAt: true },
      });

      if (!user || user.deletedAt || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Refresh session is no longer valid');
      }

      const nextRefreshToken = await this.createRefreshToken(
        user.id,
        platform,
        session.expiresAt,
        tx,
      );

      return {
        accessToken: await this.createAccessToken(user),
        refreshToken: nextRefreshToken,
        expiresAt: session.expiresAt,
      };
    });
  }

  async revokeSession(refreshToken: string, platform: AuthClientPlatform) {
    try {
      const { sessionId, secret } = this.parseRefreshToken(refreshToken);
      await this.prisma.authRefreshSession.updateMany({
        where: {
          id: sessionId,
          tokenHash: this.hashSecret(secret),
          platform: this.toPrismaPlatform(platform),
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });
    } catch {
      // Logout remains idempotent even when a browser has an old or malformed cookie.
    }
  }

  async revokeAllForUser(userId: string) {
    await this.prisma.authRefreshSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  writeResponse(response: Response, session: AuthSessionTokens, platform: AuthClientPlatform) {
    if (platform === 'mobile') {
      return { accessToken: session.accessToken, refreshToken: session.refreshToken };
    }

    response.cookie(REFRESH_COOKIE_NAME, session.refreshToken, {
      ...this.cookieOptions,
      expires: session.expiresAt,
    });
    return { accessToken: session.accessToken };
  }

  clearWebCookie(response: Response) {
    response.clearCookie(REFRESH_COOKIE_NAME, this.cookieOptions);
  }

  isAllowedWebOrigin(origin: string | undefined) {
    const normalizedOrigin = origin?.replace(/\/$/, '');
    return Boolean(normalizedOrigin && getAllowedFrontendOrigins().includes(normalizedOrigin));
  }

  private async createRefreshToken(
    userId: string,
    platform: AuthClientPlatform,
    expiresAt: Date,
    client: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const secret = randomBytes(32).toString('base64url');
    const session = await client.authRefreshSession.create({
      data: {
        userId,
        tokenHash: this.hashSecret(secret),
        platform: this.toPrismaPlatform(platform),
        expiresAt,
      },
      select: { id: true },
    });

    return `${session.id}.${secret}`;
  }

  private createAccessToken(user: Pick<User, 'id' | 'email' | 'role'>) {
    return this.jwtService.signAsync(
      { email: user.email, id: user.id, role: user.role },
      { expiresIn: ACCESS_TOKEN_TTL },
    );
  }

  private parseRefreshToken(refreshToken: string) {
    const [sessionId, secret, ...rest] = refreshToken.split('.');

    if (!sessionId || !secret || rest.length > 0) {
      throw new UnauthorizedException('Refresh session is no longer valid');
    }

    return { sessionId, secret };
  }

  private hashSecret(secret: string) {
    return createHash('sha256').update(secret).digest('hex');
  }

  private toPrismaPlatform(platform: AuthClientPlatform) {
    return platform === 'web' ? AuthSessionPlatform.WEB : AuthSessionPlatform.MOBILE;
  }

  private get cookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      path: '/auth',
    };
  }
}
