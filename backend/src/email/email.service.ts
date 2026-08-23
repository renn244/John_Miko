import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(params: {
    subject: string;
    to: string;
    template: string;
    context: ISendMailOptions['context'];
  }) {
    if (this.configService.get<string>('EMAIL_ENABLED') === 'false') {
      this.logger.debug(
        `Email delivery disabled; skipped "${params.subject}".`,
      );
      return;
    }

    try {
      const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '');
      const logoUrl = frontendUrl
        ? `${frontendUrl}/logo/JMPort_With_MarkDown.png`
        : undefined;
      const emailOptions: ISendMailOptions = {
        to: params.to,
        subject: params.subject,
        template: params.template,
        context: {
          ...params.context,
          logoUrl,
        },
      };

      await this.mailerService.sendMail(emailOptions);
      this.logger.log(
        `Email sent to ${params.to} with subject "${params.subject}"`,
      );
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Failed to send email to ${params.to} with subject "${params.subject}"`,
        error,
      );
      throw error;
    }
  }
}
