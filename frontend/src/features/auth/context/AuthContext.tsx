import apiClient, { refreshAccessToken } from "@/lib/apiClient";
import { broadcastLogout, clearAccessToken, getAccessToken, subscribeToLogout } from "@/lib/tokenStorage";
import { isStaffRole, type StaffRole, type UserProfileDto } from "@/features/auth/types/auth.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, type PropsWithChildren } from "react";

type AuthContextType = {
    user: UserProfileDto | null,
    isLoading: boolean;
    isLoggedIn: boolean;
    isStaff: boolean;
    staffRole: StaffRole | null;
    handleLogout: () => Promise<void>;
}

const initialAuthContext: AuthContextType = {
    user: null,
    isLoading: true,
    isLoggedIn: false,
    isStaff: false,
    staffRole: null,
    handleLogout: async () => {}
}

const AuthContext = createContext<AuthContextType>(initialAuthContext);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    return useContext(AuthContext);
}

const AuthProvider = ({ children }: PropsWithChildren ) => {
    const queryClient = useQueryClient();
    const { data: queriedUser, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            if (!getAccessToken() && !(await refreshAccessToken())) return null;

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

    const clearAuthenticatedUser = useCallback(() => {
        queryClient.cancelQueries({ queryKey: ['user'] });
        queryClient.setQueryData(['user'], null);
    }, [queryClient]);

    useEffect(() => {
        return subscribeToLogout(clearAuthenticatedUser);
    }, [clearAuthenticatedUser]);

    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            clearAccessToken();
            broadcastLogout();
        }
        clearAuthenticatedUser();
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
