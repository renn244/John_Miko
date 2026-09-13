import apiClient from "@/lib/apiClient";
import { clearAccessToken, getAccessToken } from "@/lib/tokenStorage";
import { isStaffRole, type StaffRole, type UserProfileDto } from "@/features/auth/types/auth.types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type PropsWithChildren } from "react";

type AuthContextType = {
    user: UserProfileDto | null,
    isLoading: boolean;
    isLoggedIn: boolean;
    isStaff: boolean;
    staffRole: StaffRole | null;
    handleLogout: () => void;
}

const initialAuthContext: AuthContextType = {
    user: null,
    isLoading: true,
    isLoggedIn: false,
    isStaff: false,
    staffRole: null,
    handleLogout: () => {}
}

const AuthContext = createContext<AuthContextType>(initialAuthContext);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    return useContext(AuthContext);
}

const AuthProvider = ({ children }: PropsWithChildren ) => {
    const { data: queriedUser, isLoading, refetch } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            if (!getAccessToken()) return null;

            try {
                const response = await apiClient.get('/auth/profile');

                if(response.status === 401) {
                    clearAccessToken();
                    return null;
                }

                if(response.status >= 400) return null;

                return response.data as UserProfileDto;
            } catch {
                return null;
            }
        },
        refetchOnWindowFocus: false,
    })

    const user = queriedUser ?? null;
    const staffRole = user && isStaffRole(user.role) ? user.role : null;

    const handleLogout = () => {
        clearAccessToken();
        refetch();
    }

    const value = {
        user,
        isLoading,
        isLoggedIn: !!user,
        isStaff: !!staffRole,
        staffRole,
        handleLogout
    } satisfies AuthContextType;
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
