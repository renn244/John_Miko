import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StaffRole } from "@/types/auth.type";

const getRoleTourStorageKey = (userId: string, role: StaffRole, version: string) =>
  `role_tour_seen:${version}:${userId}:${role}`;

export const hasSeenRoleTour = async (userId: string, role: StaffRole, version: string) => {
  const value = await AsyncStorage.getItem(getRoleTourStorageKey(userId, role, version));
  return value === "true";
};

export const setSeenRoleTour = async (userId: string, role: StaffRole, version: string) => {
  await AsyncStorage.setItem(getRoleTourStorageKey(userId, role, version), "true");
};
