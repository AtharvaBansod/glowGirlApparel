'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { AnalyticsData } from '@/types';

export default function AdminDashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Redirect if not authenticated or not an admin
        if (!authLoading) {
            if (!user) {
                router.replace('/login');
                return;
            }
            if (!user.isAdmin) {
                toast.error("Access Denied. You are not an admin.");
                router.replace('/');
                return;
            }
        }

        const fetchAnalytics = async () => {
            try {
                // This new API route will provide all necessary dashboard stats
                const response = await fetch('/api/admin/analytics');
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data.');
                }
                const data = await response.json();
                setAnalytics(data);
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.isAdmin) {
            fetchAnalytics();
        }
    }, [user, authLoading, router]);

    // Show a loading state while checking auth or fetching data
    if (authLoading || isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }
    
    if (!analytics) {
        return (
            <div className="container text-center py-10">
                <p>Could not load dashboard data. Please try again later.</p>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <AdminDashboard data={analytics} />
        </div>
    );
}