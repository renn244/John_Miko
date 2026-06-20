import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { EmailService } from "src/email/email.service";
import { ValidationException } from "src/lib/exception/ValidationException";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { v4 as uuidv4 } from "uuid";
import { resetPasswordDto } from "./dto/forgotPassword.dto";

@Injectable()
export class ForgotPasswordService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
        private readonly userService: UserService,
    ) {}

    private appendPath(baseUrl: string, path: string) {
        const normalizedPath = path.replace(/^\/+/, '');

        if (baseUrl.endsWith('://')) {
            return `${baseUrl}${normalizedPath}`;
        }

        return `${baseUrl.replace(/\/+$/, '')}/${normalizedPath}`;
    }

    private buildResetUrl(baseUrl: string | undefined, token: string) {
        if (!baseUrl) {
            throw new Error('Reset password URL is not configured');
        }

        const resetUrl = this.appendPath(baseUrl, 'reset-password');

        return `${resetUrl}?token=${encodeURIComponent(token)}`;
    }

    private buildMobileResetRedirectUrl(token: string) {
        const bridgeBaseUrl = process.env.PASSWORD_RESET_BRIDGE_URL
            || process.env.BACKEND_URL
            || 'http://localhost:3000';
        const bridgeUrl = this.appendPath(bridgeBaseUrl, 'auth/reset-password/open');

        return `${bridgeUrl}?token=${encodeURIComponent(token)}`;
    }

    buildMobileResetUrl(token: string) {
        return this.buildResetUrl(process.env.MOBILE_URL, token);
    }

    // do we also need to add roles validation for here later on
    private async generateAndSendResetToken(email: string) {
        const user = await this.userService.findUserByEmail(email);

        if (!user) {
            throw new ValidationException({
                field: 'email',
                message: ['User with this email does not exist']
            });
        }

        await this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

        const rawToken = uuidv4();
        await this.prisma.passwordResetToken.create({
            data: {
                token: rawToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
            }
        });

        const isMobileUser = this.userService.isMobileUserByRole(user.role)
        const confirmationUrl = isMobileUser 
            ? this.buildMobileResetRedirectUrl(rawToken)
            : this.buildResetUrl(process.env.FRONTEND_URL, rawToken)

        await this.emailService.sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            template: 'forgotPassword',
            context: {
                email,
                confirmationUrl: confirmationUrl
            }
        });
    }

    async forgetPassword(email: string) {
        await this.generateAndSendResetToken(email);
        return { message: 'Password reset email sent' };
    }

    async resendForgotPassword(email: string) {
        await this.generateAndSendResetToken(email);
        return { message: 'Password reset email resent' };
    }

    async resetPassword({ token, newPassword }: resetPasswordDto) {
        const existingToken = await this.prisma.passwordResetToken.findFirst({
            where: { token }
        });

        if (!existingToken) {
            throw new BadRequestException('Invalid Token');
        }

        if (existingToken.expiresAt < new Date()) {
            throw new BadRequestException('Token has expired');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { id: existingToken.userId },
            data: { password: hashedNewPassword }
        });

        await this.prisma.passwordResetToken.deleteMany({ where: { userId: existingToken.userId } });

        return { message: 'Password changed successfully' };
    }
}
