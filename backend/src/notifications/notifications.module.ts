import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExpoPushNotificationProvider } from './expo-push-notification.provider';
import { PushNotificationService } from './push-notification.service';
import { PUSH_NOTIFICATION_PROVIDER } from './push-notification.types';

@Module({
  imports: [HttpModule.register({ timeout: 5_000 })],
  providers: [
    ExpoPushNotificationProvider,
    {
      provide: PUSH_NOTIFICATION_PROVIDER,
      useExisting: ExpoPushNotificationProvider,
    },
    PushNotificationService,
  ],
  exports: [PushNotificationService],
})
export class NotificationsModule {}
