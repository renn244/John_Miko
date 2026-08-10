import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import apiClient from "@/lib/apiClient";

const ANDROID_CHANNEL_ID = "maintenance-tasks";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForMaintenancePushNotifications(): Promise<void> {
  if (!Device.isDevice) return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: "Maintenance tasks",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
    });
  }

  const permissions = await Notifications.getPermissionsAsync();
  let status = permissions.status;

  if (status !== "granted") {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    status = requestedPermissions.status;
  }

  if (status !== "granted") return;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  if (!projectId) {
    throw new Error("Expo project ID is not configured.");
  }

  const expoPushToken = (
    await Notifications.getExpoPushTokenAsync({ projectId })
  ).data;
  const response = await apiClient.patch("/auth/push-token", { expoPushToken });

  if (response.status >= 400) {
    throw new Error(response.data?.message || "Could not register push notifications.");
  }

}

export async function unregisterPushNotifications() {
  const response = await apiClient.delete("/auth/push-token");

  if (response.status >= 400) {
    throw new Error(response.data?.message || "Could not remove push notifications.");
  }
}

export function getMaintenanceIdFromNotification(
  notification: Notifications.Notification,
) {
  const maintenanceId = notification.request.content.data?.maintenanceId;
  return typeof maintenanceId === "string" ? maintenanceId : null;
}
