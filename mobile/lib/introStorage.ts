import AsyncStorage from "@react-native-async-storage/async-storage";

const INTRO_SEEN_KEY = "intro_seen";

export const hasSeenIntro = async () => {
  const value = await AsyncStorage.getItem(INTRO_SEEN_KEY);
  return value === "true";
};

export const setSeenIntro = async () => {
  await AsyncStorage.setItem(INTRO_SEEN_KEY, "true");
};
