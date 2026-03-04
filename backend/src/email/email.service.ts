import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    constructor(
        private readonly mailerService: MailerService
    ) {}
    
    async sendEmail(params: {
        subject: string;
        to: string;
        template: string;
        context: ISendMailOptions['context'];
    }) {
        try {
            console.log(params.template)
            const emailOptions: ISendMailOptions = {
                to: params.to,
                subject: params.subject,
                template: params.template,
                context: params.context,
            }

            const response = await this.mailerService.sendMail(emailOptions);
            this.logger.log(`Email sent to ${params.to} with subject "${params.subject}"`);
        } catch (error) {
            console.error(error);
            this.logger.error(`Failed to send email to ${params.to} with subject "${params.subject}"`, error.stack);
        }
    }
}
