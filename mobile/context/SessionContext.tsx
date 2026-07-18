import { InvalidSessionError } from "@/lib/auth/errors";
import { fetchCurrentProfile } from "@/hooks/profile.hook";
import { deleteAccessToken, getAccessToken } from "@/lib/tokenStorage";
import type { AuthUser } from "@/types/auth.type";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated" | "unavailable";

type SessionState = {
  status: SessionStatus;
  user: AuthUser | null;
  error: string | null;
};

type SessionContextValue = SessionState & {
  refreshSession: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const initialState: SessionState = {
  status: "loading",
  user: null,
  error: null,
};

export function SessionProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<SessionState>(initialState);
  const refreshSession = useCallback(async () => {
    setSession({ status: "loading", user: null, error: null });

    try {
      const token = await getAccessToken();

      if (!token) {
        setSession({ status: "unauthenticated", user: null, error: null });
        return null;
      }

      const user = await fetchCurrentProfile();

      setSession({ status: "authenticated", user, error: null });

      return user;
    } catch (error) {
      if (error instanceof InvalidSessionError) {
        await deleteAccessToken();
        queryClient.clear();
        setSession({ status: "unauthenticated", user: null, error: null });
        return null;
      }

      const message = error instanceof Error ? error.message : "Unable to reach your workspace.";
      setSession({ status: "unavailable", user: null, error: message });
      return null;
    }
  }, [queryClient]);

  const signOut = useCallback(async () => {
    await deleteAccessToken();
    queryClient.clear();
    setSession({ status: "unauthenticated", user: null, error: null });
  }, [queryClient]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({ ...session, refreshSession, signOut }),
    [refreshSession, session, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within SessionProvider.");
  }

  return context;
}
