import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserStatus } from 'src/generated/prisma/client';
import { IS_PUBLIC_KEY } from 'src/lib/decorators/Public.decorator';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: UserSession }>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    let payload: UserSession;

    try {
      payload = await this.jwtService.verifyAsync<UserSession>(token);
    } catch {
      throw new UnauthorizedException();
    }

    if (!payload.id) {
      throw new UnauthorizedException();
    }

    const currentUser = await this.prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!currentUser || currentUser.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Session is no longer valid');
    }

    request.user = {
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
    } satisfies UserSession;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
