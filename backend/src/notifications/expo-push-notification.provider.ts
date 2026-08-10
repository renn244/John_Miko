import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import type {
  ExpoPushResponse,
  MaintenancePushNotification,
  PushDeliveryResult,
  PushNotificationProvider,
} from './push-notification.types';

@Injectable()
export class ExpoPushNotificationProvider implements PushNotificationProvider {
  private readonly logger = new Logger(ExpoPushNotificationProvider.name);
  private readonly expoPushUrl: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.expoPushUrl = config.getOrThrow<string>('EXPO_PUSH_URL');
  }

  async sendMaintenanceAssignment(
    notification: MaintenancePushNotification,
  ): Promise<PushDeliveryResult> {
    try {
      const response = await lastValueFrom(
        this.http.post<ExpoPushResponse>(this.expoPushUrl, {
          to: notification.expoPushToken,
          sound: 'default',
          title: 'New maintenance task',
          body: `${notification.title} (${notification.priority} priority)`,
          priority: 'high',
          channelId: 'maintenance-tasks',
          data: {
            type: 'maintenance-assignment',
            maintenanceId: notification.maintenanceId,
          },
        }),
      );
      const ticket = response.data.data?.[0];

      if (ticket?.status !== 'error') return {};

      this.logger.warn(
        `Expo rejected push for maintenance ${notification.maintenanceId}: ${ticket.message ?? 'unknown error'}`,
      );

      return {
        deviceNotRegistered: ticket.details?.error === 'DeviceNotRegistered',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown error';
      this.logger.warn(
        `Could not send maintenance push for ${notification.maintenanceId}: ${message}`,
      );
      return {};
    }
  }
}
