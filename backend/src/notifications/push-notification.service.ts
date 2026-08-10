import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PUSH_NOTIFICATION_PROVIDER,
  type PushNotificationProvider,
} from './push-notification.types';

@Injectable()
export class PushNotificationService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(PUSH_NOTIFICATION_PROVIDER)
    private readonly provider: PushNotificationProvider,
  ) {}

  async sendMaintenanceAssignment(input: {
    userId: string;
    maintenanceId: string;
    title: string;
    priority: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { id: input.userId },
      select: { expoPushToken: true },
    });

    if (!user?.expoPushToken) return;

    const expoPushToken = user.expoPushToken;
    const result = await this.provider.sendMaintenanceAssignment({
      expoPushToken,
      maintenanceId: input.maintenanceId,
      title: input.title,
      priority: input.priority,
    });

    if (result.deviceNotRegistered) {
      await this.prisma.user.updateMany({
        where: { id: input.userId, expoPushToken },
        data: { expoPushToken: null },
      });
    }
  }
}
