'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Start loading until we verify the user
    const router = useRouter();

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                // This API route verifies the token in the cookie and returns the user
                const response = await fetch('/api/users/me');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null); // Set user to null on any error
            } finally {
                setLoading(false);
            }
        };

        checkUserSession();
    }, []);

    const logout = async () => {
        try {
            await fetch('/api/auth/logout');
            setUser(null);
            toast.success("Logged out successfully.");
            router.push('/login');
        } catch (error) {
            toast.error("Failed to log out. Please try again.");
        }
    };

    // While checking the session, you might want to show a global loader
    // or let individual components handle their own loading state.
    // Here, we just pass the loading state down for flexibility.
    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    const value = { user, loading, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};