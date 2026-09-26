const ACCESS_TOKEN_KEY = "access_token";

type LogoutListener = () => void;
const logoutListeners = new Set<LogoutListener>();
const authChannel =
  typeof BroadcastChannel === "undefined"
    ? null
    : new BroadcastChannel("jmport-auth");

authChannel?.addEventListener("message", (event: MessageEvent<unknown>) => {
  if (event.data !== "logout") return;

  clearAccessToken();
  logoutListeners.forEach((listener) => listener());
});

export const getAccessToken = () => window.localStorage.getItem(ACCESS_TOKEN_KEY);

export const saveAccessToken = (token: string) => {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = () => {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const broadcastLogout = () => {
  authChannel?.postMessage("logout");
};

export const subscribeToLogout = (listener: LogoutListener) => {
  logoutListeners.add(listener);
  return () => {
    logoutListeners.delete(listener);
  };
};
