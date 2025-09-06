'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import AdminContacts from '@/components/admin/AdminContacts';
import { Contact, PaginationData } from '@/types';

export default function AdminContactsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [queries, setQueries] = useState<Contact[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchQueries = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/contacts?page=${currentPage}`);
            if (!response.ok) throw new Error('Failed to fetch contact queries.');
            const data = await response.json();
            setQueries(data.queries);
            setPagination({
                total: data.total,
                page: data.page,
                totalPages: data.totalPages,
            });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        if (!authLoading && user?.isAdmin) {
            fetchQueries();
        }
    }, [user, authLoading, fetchQueries]);
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (authLoading) {
        return <div className="flex justify-center items-center h-[calc(100vh-80px)]"><LoadingSpinner size="lg" /></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Contact Queries</h1>
            {isLoading && queries.length === 0 ? (
                 <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>
            ) : (
                <AdminContacts
                    queries={queries}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
