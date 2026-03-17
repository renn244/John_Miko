import { useAuthContext } from "@/context/AuthContext";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router";

type ProtectedRouteProps = {
    rolesAllowed: string[] // do enum later
} & PropsWithChildren

const ProtectedRoute = ({ children, rolesAllowed }: ProtectedRouteProps) => {
    const { user } = useAuthContext();
    
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!rolesAllowed.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;