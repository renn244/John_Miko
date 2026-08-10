export const PUSH_NOTIFICATION_PROVIDER = 'PUSH_NOTIFICATION_PROVIDER';

export type MaintenancePushNotification = {
  expoPushToken: string;
  maintenanceId: string;
  title: string;
  priority: string;
};

export type PushDeliveryResult = {
  deviceNotRegistered?: boolean;
};

export interface PushNotificationProvider {
  sendMaintenanceAssignment(
    notification: MaintenancePushNotification,
  ): Promise<PushDeliveryResult>;
}

export type ExpoPushTicket = {
  status?: 'ok' | 'error';
  message?: string;
  details?: { error?: string };
};

export type ExpoPushResponse = {
  data?: ExpoPushTicket[];
};
