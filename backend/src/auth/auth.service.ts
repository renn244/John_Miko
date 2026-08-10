import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly authSessionCache: AuthSessionCacheService,
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
    
        return this.loginJWT(createdUser)
    }

    async SignIn(email: string, password: string, userRole: Role, rememberMe = false) {
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

        if(user.status === "INACTIVE") {
            throw new ForbiddenException("Your account is deactivated!")
        }

        if(user.role !== userRole) {
            throw new ValidationException({
                field: "root",
                message: ["Invalid email or password"]
            });
        }

        return this.loginJWT(user, rememberMe);
    }

    async loginJWT(user: User, rememberMe = false) {
        const payload = { email: user.email, id: user.id, role: user.role };

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: rememberMe ? '30d' : '7d',
        });

        return { accessToken };
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
                status: true
            }
        });

        //maybe add a cache layer in here later

        return userProfile;
    }

    async updateProfile(user: UserSession, body: UpdateProfileDto) {
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
                email: body.email,
                contactNo: body.contactNo
            }
        })

        await this.authSessionCache.invalidate(user.id);

        return updatedUser;
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
