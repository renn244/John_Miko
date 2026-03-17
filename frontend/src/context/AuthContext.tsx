import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type PropsWithChildren } from "react";

type userProfile = {
    id: string;
    email: string;
    role: string;
}

type AuthContextType = {
    user: userProfile | undefined,
    isLoading: boolean;
    isLoggedIn: boolean;    
}

const initialAuthContext: AuthContextType = {
    user: undefined,
    isLoading: true,
    isLoggedIn: false
}

const AuthContext = createContext<AuthContextType>(initialAuthContext);

export const useAuthContext = () => {
    return useContext(AuthContext);
}

const AuthProvider = ({ children }: PropsWithChildren ) => {
    
    const { data: user, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            
            if(!localStorage.getItem('access_token')) return undefined

            const response = await apiClient.get('/auth/profile').catch(() => undefined)

            if(!response) return undefined
            
            return response?.data as userProfile
        },
        refetchOnWindowFocus: false,
    })

    const value = {
        user,
        isLoading,
        isLoggedIn: !!user
    } satisfies AuthContextType;
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider