import { readFileSync } from 'fs';
import { join } from 'path';
import * as Handlebars from 'handlebars';
import { PaymentEmailService } from './payment-email.service';

describe('Recorded refund email', () => {
  const prisma = { payment: { findUnique: jest.fn() } };
  const email = { sendEmail: jest.fn() };
  const service = new PaymentEmailService(prisma as any, email as any);
  const previousUrl = process.env.FRONTEND_URL;
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.FRONTEND_URL = 'https://resort.example/';
  });
  afterAll(() => {
    if (previousUrl === undefined) delete process.env.FRONTEND_URL;
    else process.env.FRONTEND_URL = previousUrl;
  });

  it('renders the saved amount, date, reason and owner booking link without embedding private proof', async () => {
    prisma.payment.findUnique.mockResolvedValue({
      status: 'Refunded', amountPaid: 5000, refundReason: '<script>unsafe</script>',
      refundedAt: new Date('2026-09-11T17:00:00Z'), refundProofImageUrl: 'private-proof',
      booking: { id: 'booking-id', referenceCode: 'BK-20260912-REFUND', email: 'guest@example.com', guestName: 'QA Guest' },
    });
    await service.sendRefundedEmail('payment');
    const message = email.sendEmail.mock.calls[0][0];
    expect(message).toMatchObject({ to: 'guest@example.com', template: 'paymentRefunded', context: {
      bookingReference: 'BK-20260912-REFUND', myBookingsUrl: 'https://resort.example/my-bookings',
      refundAmount: expect.stringContaining('5,000.00'), refundedAt: expect.stringContaining('Sep 12, 2026'),
    } });
    const html = Handlebars.compile(readFileSync(join(__dirname, '../templates/paymentRefunded.hbs'), 'utf8'))(message.context);
    expect(html).toContain('BK-20260912-REFUND');
    expect(html).toContain('https://resort.example/my-bookings');
    expect(html).toContain('&lt;script&gt;unsafe&lt;/script&gt;');
    expect(html).not.toContain('private-proof');
    expect(html).not.toContain('Payment Due');
  });

  it.each([null, { status: 'Rejected' }])('does not notify for an absent or non-refunded record', async (payment) => {
    prisma.payment.findUnique.mockResolvedValue(payment);
    await service.sendRefundedEmail('payment');
    expect(email.sendEmail).not.toHaveBeenCalled();
  });
});
