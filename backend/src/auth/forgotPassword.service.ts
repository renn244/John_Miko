import { BadRequestException, Injectable } from "@nestjs/common";
import { EmailService } from "src/email/email.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from 'bcrypt';
import { resetPasswordDto } from "./dto/forgotPassword.dto";

@Injectable()
export class ForgotPasswordService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
        private readonly userService: UserService,
    ) {}

    // do we also need to add roles validation for here later on
    private async generateAndSendResetToken(email: string) {
        const user = await this.userService.findUserByEmail(email);

        if (!user) throw new BadRequestException('User with this email does not exist');

        await this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

        const rawToken = uuidv4();
        await this.prisma.passwordResetToken.create({
            data: {
                token: rawToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
            }
        });

        this.emailService.sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            template: 'forgotPassword',
            context: {
                email,
                confirmationUrl: `${process.env.FRONTEND_URL}/reset-password/${rawToken}`
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

    async resetPassword({ token, newPassword, confirmPassword }: resetPasswordDto) {
        const existingToken = await this.prisma.passwordResetToken.findFirst({
            where: { token }
        });

        if (!existingToken) {
            throw new BadRequestException('Token does not exist');
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