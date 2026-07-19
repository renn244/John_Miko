import apiClient from "@/lib/apiClient";
import { clearAccessToken, getAccessToken } from "@/lib/tokenStorage";
import type { UserProfileDto } from "@/types/auth.types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type PropsWithChildren } from "react";

type AuthContextType = {
    user: UserProfileDto | null | undefined,
    isLoading: boolean;
    isLoggedIn: boolean;    
    handleLogout: () => void;
}

const initialAuthContext: AuthContextType = {
    user: null,
    isLoading: true,
    isLoggedIn: false,
    handleLogout: () => {}
}

const AuthContext = createContext<AuthContextType>(initialAuthContext);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    return useContext(AuthContext);
}

const AuthProvider = ({ children }: PropsWithChildren ) => {
    const { data: user, isLoading, refetch } = useQuery({
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

    const handleLogout = () => {
        clearAccessToken();
        refetch();
    }

    const value = {
        user,
        isLoading,
        isLoggedIn: !!user,
        handleLogout
    } satisfies AuthContextType;
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
