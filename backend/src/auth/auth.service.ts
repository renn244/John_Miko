import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role, User } from 'src/generated/prisma/client';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { ValidationException } from 'src/lib/exception/ValidationException';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { SignUpGuestDto } from './dto/auth.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UpdatePasswordDto } from './dto/changePassword.dto';
import { AuthSessionCacheService } from './auth-session-cache.service';
import { normalizeEmail } from 'src/lib/utils/normalizeEmail';
import { AuthRefreshSessionService, type AuthClientPlatform } from './auth-refresh-session.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly authSessionCache: AuthSessionCacheService,
        private readonly authRefreshSessionService: AuthRefreshSessionService,
    ) {}

    async SignUpGuest(body: SignUpGuestDto) {
        const existingUser = await this.userService.findUserByEmail(body.email);

        if(existingUser) {
            throw new ValidationException({
                field: "email",
                message: ["User already exist"]
            });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const createdUser = await this.userService.createUserGuest({ ...body, password: hashedPassword });
    
        return this.authRefreshSessionService.createSession(createdUser, body.platform ?? 'web')
    }

    async SignIn(email: string, password: string, userRole: Role, rememberMe = false, platform: AuthClientPlatform = 'web') {
        const user = await this.userService.findUserByEmail(email);

        if(!user) {
            throw new ValidationException({
                field: "root",
                message: ["Invalid email or password"]
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new ValidationException({
                field: "root",
                message: ["Invalid email or password"]
            });
        }

        if(user.deletedAt || user.status === "INACTIVE") {
            throw new ForbiddenException("Your account is deactivated!")
        }

        if(user.role !== userRole) {
            throw new ValidationException({
                field: "root",
                message: ["Invalid email or password"]
            });
        }

        return this.authRefreshSessionService.createSession(user, platform, rememberMe);
    }

    async refreshSession(refreshToken: string, platform: AuthClientPlatform) {
        return this.authRefreshSessionService.rotateSession(refreshToken, platform);
    }

    async logout(refreshToken: string, platform: AuthClientPlatform) {
        await this.authRefreshSessionService.revokeSession(refreshToken, platform);
    }

    async getProfile(user: UserSession) {
        const userProfile = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                contactNo: true,
                status: true,
                profileImageUrl: true,
            }
        });

        //maybe add a cache layer in here later

        return userProfile;
    }

    async updateProfile(user: UserSession, body: UpdateProfileDto) {
        const currentUser = await this.userService.findUserById(user.id);
        if (!currentUser || currentUser.deletedAt) {
            throw new BadRequestException("Deleted user is not allowed to update profile.")
        }

        const existingUser = await this.userService.findUserByEmail(body.email);

        if(existingUser?.status === "INACTIVE") {
            throw new BadRequestException("Inactive User is not allowed to update profile.")
        }

        if(existingUser && existingUser.id !== user.id) {
            throw new ValidationException({
                field: "email",
                message: ["email already exists"]
            })
        }

        const updatedUser = await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                name: body.name,
                email: normalizeEmail(body.email),
                contactNo: body.contactNo
            }
        })

        await this.authSessionCache.invalidate(user.id);

        return updatedUser;
    }

    async updateProfileImage(user: UserSession, profileImageUrl: string | null) {
        const currentUser = await this.userService.findUserById(user.id);
        if (!currentUser || currentUser.deletedAt) {
            throw new BadRequestException("Deleted user is not allowed to update profile.")
        }

        return this.prisma.user.update({
            where: { id: user.id },
            data: { profileImageUrl },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                contactNo: true,
                status: true,
                profileImageUrl: true,
            },
        });
    }

    async updatePassword(user: UserSession, body: UpdatePasswordDto) {
        const currentUser = await this.userService.findUserById(user.id);
        
        if(!currentUser) {
            throw new UnauthorizedException("User does not exist")
        }

        const isPasswordValid = await bcrypt.compare(body.currentPassword, currentUser.password)

        if(!isPasswordValid) {
            throw new ValidationException({
                field: "currentPassword",
                message: ["wrong password"]
            })
        }

        if (body.currentPassword === body.newPassword) {
            throw new ValidationException({
                field: 'newPassword',
                message: ['New password must be different from your current password'],
            });
        }

        const hashedNewPassword = await bcrypt.hash(body.newPassword, 10);
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedNewPassword
            }
        })

        if(!updatedUser) {
            throw new BadRequestException("Failed to update password, please try again.")
        }

        await this.authRefreshSessionService.revokeAllForUser(user.id);

        return { message: "Password updated successfully" }
    }

    async registerPushToken(user: UserSession, expoPushToken: string) {
        if (user.role !== Role.MAINTENANCE_STAFF) {
            throw new ForbiddenException('Only maintenance staff can register push notifications.');
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: { expoPushToken },
        });

        return { message: 'Push notifications registered.' };
    }

    async removePushToken(user: UserSession) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: { expoPushToken: null },
        });

        return { message: 'Push notifications removed.' };
    }
}
