import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/Roles.decorator";
import { UserSession } from "../decorators/User.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        // if no roles is required return true
        if(!requiredRoles) return true;

        const user: UserSession | undefined = context.switchToHttp().getRequest().user;

        if(!user) {
            throw new UnauthorizedException("User not authenticated");
        }

        return requiredRoles.some(role => user.role === role);
    }
}