'use client';

import { Order, PaginationData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface AdminOrdersProps {
    orders: Order[];
    pagination: PaginationData | null;
    isLoading: boolean;
    onPageChange: (page: number) => void;
    onStatusChange: (orderId: string, newStatus: string) => void;
    onFilterChange: (status: string | null) => void;
}

const ORDER_STATUSES = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders({
    orders,
    pagination,
    isLoading,
    onPageChange,
    onStatusChange,
    onFilterChange
}: AdminOrdersProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>All Orders</CardTitle>
                        <CardDescription>View and manage all customer orders.</CardDescription>
                    </div>
                    <div className="w-48">
                        <Select onValueChange={(value) => onFilterChange(value === 'all' ? null : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {ORDER_STATUSES.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead className="w-[150px]">Date</TableHead>
                                <TableHead className="w-[150px] text-right">Total</TableHead>
                                <TableHead className="w-[180px] text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length > 0 ? (
                                orders.map(order => (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-mono text-xs">{order._id}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.user?.name}</div>
                                            <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">₹{order.totalAmount.toFixed(2)}</TableCell>
                                        <TableCell className="text-center">
                                            <Select
                                                value={order.orderStatus}
                                                onValueChange={(newStatus) => onStatusChange(order._id, newStatus)}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ORDER_STATUSES.map(status => (
                                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        {isLoading ? 'Fetching orders...' : 'No orders found for the selected filter.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {isLoading && <div className="absolute inset-0 bg-background/50 flex items-center justify-center"><LoadingSpinner /></div>}
                </div>
            </CardContent>
            {pagination && pagination.totalPages > 1 && (
                 <CardContent>
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={onPageChange}
                    />
                </CardContent>
            )}
        </Card>
    );
}