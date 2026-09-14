import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { MaintenanceExpertise, Role } from 'src/generated/prisma/enums';

@Injectable()
export class StaffManagementEmailService {
    constructor(
        private readonly emailService: EmailService,
    ) {}

    private getDisplayName(name?: string | null) {
        return name?.trim() || 'Staff Member';
    }

    private formatRole(role: Role) {
        switch (role) {
            case Role.KITCHEN_STAFF:
                return 'Kitchen Staff';
            case Role.RESORT_STAFF:
                return 'Resort Staff';
            case Role.MAINTENANCE_STAFF:
                return 'Maintenance Staff';
            default:
                return role;
        }
    }

    private getStaffLoginUrl() {
        // Azure may expose the web allowlist through FRONTEND_URLS, while the
        // mobile URL can be a non-clickable `jmport://` deep link. Staff email
        // should always direct recipients to the web sign-in screen first.
        const configuredWebUrl = process.env.FRONTEND_URL
            || process.env.FRONTEND_URLS
                ?.split(',')
                .map((url) => url.trim())
                .find(Boolean);
        const baseUrl = configuredWebUrl || process.env.MOBILE_URL;

        if (!baseUrl) {
            return undefined;
        }

        return `${baseUrl.replace(/\/$/, '')}/login`;
    }

    async sendCreatedEmail(params: {
        name?: string | null;
        email: string;
        role: Role;
        expertise?: MaintenanceExpertise | null;
        temporaryPassword: string;
    }) {
        await this.emailService.sendEmail({
            to: params.email,
            subject: 'Your Staff Account Has Been Created',
            template: 'staffCreated',
            context: {
                name: this.getDisplayName(params.name),
                email: params.email,
                role: this.formatRole(params.role),
                expertise: params.expertise,
            temporaryPassword: params.temporaryPassword,
            accountAction: 'created',
            loginUrl: this.getStaffLoginUrl(),
            }
        });
    }

    async sendRestoredEmail(params: {
        name?: string | null;
        email: string;
        role: Role;
        expertise?: MaintenanceExpertise | null;
        temporaryPassword: string;
    }) {
        await this.emailService.sendEmail({
            to: params.email,
            subject: 'Your Staff Account Has Been Restored',
            template: 'staffCreated',
            context: {
                name: this.getDisplayName(params.name),
                email: params.email,
                role: this.formatRole(params.role),
                expertise: params.expertise,
                temporaryPassword: params.temporaryPassword,
                accountAction: 'restored',
                loginUrl: this.getStaffLoginUrl(),
            },
        });
    }

    async sendRoleUpdatedEmail(params: {
        name?: string | null;
        email: string;
        role: Role;
        expertise?: MaintenanceExpertise | null;
    }) {
        await this.emailService.sendEmail({
            to: params.email,
            subject: 'Your Staff Account Access Has Been Updated',
            template: 'staffRoleUpdated',
            context: {
                name: this.getDisplayName(params.name),
                email: params.email,
                role: this.formatRole(params.role),
                expertise: params.expertise,
                loginUrl: this.getStaffLoginUrl(),
            }
        });
    }

    async sendDeactivatedEmail(params: {
        name?: string | null;
        email: string;
        role: Role;
        expertise?: MaintenanceExpertise | null;
    }) {
        await this.emailService.sendEmail({
            to: params.email,
            subject: 'Your Staff Account Has Been Deactivated',
            template: 'staffDeactivated',
            context: {
                name: this.getDisplayName(params.name),
                email: params.email,
                role: this.formatRole(params.role),
                expertise: params.expertise,
            }
        });
    }

    async sendReactivatedEmail(params: {
        name?: string | null;
        email: string;
        role: Role;
        expertise?: MaintenanceExpertise | null;
    }) {
        await this.emailService.sendEmail({
            to: params.email,
            subject: 'Your Staff Account Has Been Reactivated',
            template: 'staffReactivated',
            context: {
                name: this.getDisplayName(params.name),
                email: params.email,
                role: this.formatRole(params.role),
                expertise: params.expertise,
                loginUrl: this.getStaffLoginUrl(),
            }
        });
    }
}
