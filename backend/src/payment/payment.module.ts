import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { PaymentController } from './payment.controller';
import { PaymentEmailService } from './payment-email.service';
import { PaymentService } from './payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentEmailService],
  imports: [EmailModule],
  exports: [PaymentService]
})
export class PaymentModule {}
