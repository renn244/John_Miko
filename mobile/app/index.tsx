import SessionGateScreen from "@/components/auth/SessionGateScreen";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { useSession } from "@/context/SessionContext";
import { hasSeenIntro } from "@/lib/introStorage";
import { getRoleRoute } from "@/lib/roleRoutes";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
  
export default function Index() {
  const router = useRouter();
  const { status, user, error, refreshSession } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    if (status !== "unauthenticated") {
      return;
    }

    const checkIntro = async () => {
      try {
        const seen = await hasSeenIntro();

        if (!isActive) return;

        router.replace(seen ? "/login" : "/onboarding");
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    };

    checkIntro();

    return () => {
      isActive = false;
    };
  }, [router, status]);

  useEffect(() => {
    if (status === "authenticated" && user) {
      router.replace(getRoleRoute(user.role));
    }
  }, [router, status, user]);

  if (status === "loading" || status === "authenticated") {
    return <SessionGateScreen status="loading" />;
  }

  if (status === "unavailable") {
    return <SessionGateScreen status="unavailable" error={error} onRetry={() => void refreshSession()} />;
  }

  if (isChecking) {
    return <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3" />;
  }

  return <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3" />;
}
