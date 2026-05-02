import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymongoService } from './paymongo.service';

// move to constants later
const PAYMONGO_PUBLIC_KEY = {
  provide: 'PAYMONGO_PUBLIC_KEY',
  useFactory: (configService: ConfigService) => {
    return configService.get<string>('PAYMONGO_PUBLIC_KEY');
  },
  inject: [ConfigService]
} satisfies Provider

const PAYMONGO_SECRET_KEY = {
  provide: 'PAYMONGO_SECRET_KEY',
  useFactory: (configService: ConfigService) => {
    return configService.get<string>('PAYMONGO_SECRET_KEY');
  },
  inject: [ConfigService]
} satisfies Provider

const PAYMONGO_API_URL = {
  provide: 'PAYMONGO_API_URL',
  useFactory: (configService: ConfigService) => {
    return configService.get<string>('PAYMONGO_API_URL');
  },
  inject: [ConfigService],
} satisfies Provider

@Module({
  imports: [HttpModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymongoService,
    PAYMONGO_PUBLIC_KEY,
    PAYMONGO_SECRET_KEY,
    PAYMONGO_API_URL
  ],
  exports: [PaymentService]
})
export class PaymentModule {}
