import type { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExpoPushNotificationProvider } from './expo-push-notification.provider';
import { PushNotificationService } from './push-notification.service';
import type {
  ExpoPushResponse,
  PushNotificationProvider,
} from './push-notification.types';

describe('PushNotificationService', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      updateMany: jest.fn(),
    },
  };
  const provider = {
    sendMaintenanceAssignment: jest.fn(),
  };
  let service: PushNotificationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PushNotificationService(
      prisma as unknown as PrismaService,
      provider as PushNotificationProvider,
    );
  });

  it("sends the assigned task to the user's Expo token", async () => {
    prisma.user.findUnique.mockResolvedValue({
      expoPushToken: 'ExponentPushToken[staff-device]',
    });
    provider.sendMaintenanceAssignment.mockResolvedValue({});

    await service.sendMaintenanceAssignment({
      userId: 'staff-1',
      maintenanceId: 'maintenance-1',
      title: 'Pool pump repair',
      priority: 'High',
    });

    expect(provider.sendMaintenanceAssignment).toHaveBeenCalledWith({
      expoPushToken: 'ExponentPushToken[staff-device]',
      maintenanceId: 'maintenance-1',
      title: 'Pool pump repair',
      priority: 'High',
    });
  });

  it('clears an Expo token when its device is no longer registered', async () => {
    prisma.user.findUnique.mockResolvedValue({
      expoPushToken: 'ExponentPushToken[staff-device]',
    });
    provider.sendMaintenanceAssignment.mockResolvedValue({
      deviceNotRegistered: true,
    });

    await service.sendMaintenanceAssignment({
      userId: 'staff-1',
      maintenanceId: 'maintenance-1',
      title: 'Pool pump repair',
      priority: 'High',
    });

    expect(prisma.user.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'staff-1',
        expoPushToken: 'ExponentPushToken[staff-device]',
      },
      data: { expoPushToken: null },
    });
  });
});

describe('ExpoPushNotificationProvider', () => {
  const http = { post: jest.fn() };
  const config = {
    getOrThrow: jest
      .fn()
      .mockReturnValue('https://exp.host/--/api/v2/push/send'),
  };
  let provider: ExpoPushNotificationProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new ExpoPushNotificationProvider(
      http as unknown as HttpService,
      config as unknown as import('@nestjs/config').ConfigService,
    );
  });

  it('sends the Expo payload through HttpModule', async () => {
    const response: AxiosResponse<ExpoPushResponse> = {
      data: { data: [{ status: 'ok' }] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as AxiosResponse['config'],
    };
    http.post.mockReturnValue(of(response));

    await provider.sendMaintenanceAssignment({
      expoPushToken: 'ExponentPushToken[staff-device]',
      maintenanceId: 'maintenance-1',
      title: 'Pool pump repair',
      priority: 'High',
    });

    expect(http.post).toHaveBeenCalledWith(
      'https://exp.host/--/api/v2/push/send',
      expect.objectContaining({
        to: 'ExponentPushToken[staff-device]',
        data: {
          type: 'maintenance-assignment',
          maintenanceId: 'maintenance-1',
        },
      }),
    );
  });
});
