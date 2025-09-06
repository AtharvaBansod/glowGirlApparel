'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import AdminOrders from '@/components/admin/AdminOrders';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Order, PaginationData } from '@/types';

export default function AdminOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [orders, setOrders] = useState<Order[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [filters, setFilters] = useState<{ status: string | null }>({ status: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            if (filters.status) {
                params.append('status', filters.status);
            }

            const response = await fetch(`/api/admin/orders?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders.');
            }
            const data = await response.json();
            setOrders(data.orders);
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
    }, [currentPage, filters]);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.replace('/login');
            } else if (!user.isAdmin) {
                toast.error("Access Denied. You are not an admin.");
                router.replace('/');
            } else {
                fetchOrders();
            }
        }
    }, [user, authLoading, router, fetchOrders]);
    
    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to update status.");
            }
            
            // --- FIX IS HERE ---
            // We cast `newStatus` to the correct type to satisfy TypeScript.
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, orderStatus: newStatus as Order['orderStatus'] } : order
                )
            );
            toast.success(data.message);

        } catch (error: any) {
            toast.error(error.message);
        }
    };
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (status: string | null) => {
        setCurrentPage(1);
        setFilters({ status });
    };

    if (authLoading) {
        return <div className="flex justify-center items-center h-[calc(100vh-80px)]"><LoadingSpinner size="lg" /></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
            {isLoading && orders.length === 0 ? (
                 <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>
            ) : (
                <AdminOrders
                    orders={orders}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onStatusChange={handleStatusChange}
                    onFilterChange={handleFilterChange}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
