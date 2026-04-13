import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type PropsWithChildren } from "react";

type userProfile = {
    id: string;
    name: string | null | undefined;
    email: string;
    role: string;
}

type AuthContextType = {
    user: userProfile | null | undefined,
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

export const useAuthContext = () => {
    return useContext(AuthContext);
}

const AuthProvider = ({ children }: PropsWithChildren ) => {
    const { data: user, isLoading, refetch } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await apiClient.get('/auth/profile').catch(() => null)

            if(response?.status === 401) return null
            
            return response?.data as userProfile
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