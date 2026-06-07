import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type PropsWithChildren } from "react";
import type { UserProfileDto } from "@/types/auth.types";

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
            const response = await apiClient.get('/auth/profile').catch(() => null)

            if(response?.status === 401) return null
            
            return response?.data as UserProfileDto
        },
        refetchOnWindowFocus: false,
    })

    const handleLogout = () => {
        localStorage.removeItem('access_token');
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
