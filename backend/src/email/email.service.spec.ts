import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  const sendMail = jest.fn();

  beforeEach(async () => {
    sendMail.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: { sendMail },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('adds the public brand logo URL to template context', async () => {
    const originalFrontendUrl = process.env.FRONTEND_URL;
    process.env.FRONTEND_URL = 'https://johnmikosplace.example.test/';
    sendMail.mockResolvedValue(undefined);

    await service.sendEmail({
      to: 'guest@example.test',
      subject: 'Test email',
      template: 'forgotPassword',
      context: { email: 'guest@example.test' },
    });

    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      context: expect.objectContaining({
        logoUrl: 'https://johnmikosplace.example.test/logo/JMPort_With_MarkDown.png',
      }),
    }));

    process.env.FRONTEND_URL = originalFrontendUrl;
  });
});
