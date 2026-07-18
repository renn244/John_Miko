import { useSession } from "@/context/SessionContext";
import { useRoleTour } from "@/context/RoleTourContext";
import type { StaffRole } from "@/types/auth.type";
import { useEffect } from "react";

export function useRoleTourAutoStart(role: StaffRole) {
  const { user } = useSession();
  const { requestAutoStart } = useRoleTour();

  useEffect(() => {
    if (!user || user.role !== role) return;

    void requestAutoStart(user);
  }, [requestAutoStart, role, user]);
}
