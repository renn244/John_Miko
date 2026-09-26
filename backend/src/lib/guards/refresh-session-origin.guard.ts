import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthRefreshSessionService } from 'src/auth/auth-refresh-session.service';

@Injectable()
export class RefreshSessionOriginGuard implements CanActivate {
  constructor(private readonly authRefreshSessions: AuthRefreshSessionService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    if (!this.authRefreshSessions.isAllowedWebOrigin(request.headers.origin)) {
      throw new BadRequestException('Invalid request origin');
    }

    return true;
  }
}
