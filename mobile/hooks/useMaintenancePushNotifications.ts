import {
  getMaintenanceIdFromNotification,
  registerForMaintenancePushNotifications,
} from "@/lib/pushNotifications";
import * as Notifications from "expo-notifications";
import { type Href, useRouter } from "expo-router";
import { useEffect } from "react";

export function useMaintenancePushNotifications(enabled: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    void registerForMaintenancePushNotifications().catch(() => {
      // Notifications are optional. The maintenance list remains available without them.
    });
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const openMaintenanceTicket = (notification: Notifications.Notification) => {
      const maintenanceId = getMaintenanceIdFromNotification(notification);
      if (!maintenanceId) return;

      router.push(
        `/maintenance-staff/(assigned)/ticket/${maintenanceId}` as Href,
      );
      Notifications.clearLastNotificationResponse();
    };

    const previousResponse = Notifications.getLastNotificationResponse();
    if (previousResponse?.notification) {
      openMaintenanceTicket(previousResponse.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => openMaintenanceTicket(response.notification),
    );

    return () => subscription.remove();
  }, [enabled, router]);
}
