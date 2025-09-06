'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApiContext } from '@/contexts/ApiContext';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

import ProfileForm from '@/components/auth/ProfileForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const { getUserProfile } = useApiContext();
    const router = useRouter();

    const [profileData, setProfileData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This effect handles the entire logic for the page
        if (authLoading) {
            // If the auth context is still figuring out if we're logged in, do nothing yet.
            return;
        }

        if (!user) {
            // If auth is done and there's no user, redirect to login.
            toast.error("Please log in to view your profile.");
            router.replace('/login');
            return;
        }

        // If we have a user, fetch their detailed profile data.
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setProfileData(data.user);
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch profile data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user, authLoading, router, getUserProfile]);

    // Show a loading spinner while checking auth or fetching data
    if (authLoading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // If fetching finished but we still have no data, show an error.
    if (!profileData) {
         return (
            <div className="container text-center py-10">
                <p>Could not load profile data. Please try logging in again.</p>
            </div>
        );
    }
    
    // Once data is loaded, render the form component
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                <p className="text-muted-foreground mb-8">Manage your personal information and addresses.</p>
                <ProfileForm user={profileData} />
            </div>
        </div>
    );
}
