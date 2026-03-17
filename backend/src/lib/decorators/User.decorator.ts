import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User as UserType } from "src/generated/prisma/client";

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
)

export type UserSession = {
    id: UserType['id'];
    email: UserType['email'];
    role: UserType['role'];
}