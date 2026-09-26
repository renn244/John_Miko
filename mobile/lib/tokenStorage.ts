import * as SecureStore from "expo-secure-store";

const REFRESH_TOKEN_KEY = "refresh_token";
let accessToken: string | null = null;

export function saveAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function deleteAccessToken() {
  accessToken = null;
}

export async function saveRefreshToken(token: string) {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function deleteRefreshToken() {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
