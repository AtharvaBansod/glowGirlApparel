'use client';

import { Contact, PaginationData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Pagination } from '@/components/common/Pagination';
import { Badge } from '../ui/badge';

interface AdminContactsProps {
    queries: Contact[];
    pagination: PaginationData | null;
    isLoading: boolean;
    onPageChange: (page: number) => void;
}

export default function AdminContacts({ queries, pagination, isLoading, onPageChange }: AdminContactsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Inbox</CardTitle>
                <CardDescription>Messages received from customers via the contact form.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {queries.length > 0 ? (
                    queries.map(query => (
                        <div key={query._id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-semibold">{query.user.name}</p>
                                    <p className="text-sm text-muted-foreground">{query.user.email}</p>
                                </div>
                                <div className="text-right">
                                     <Badge variant={query.queryType === 'Order Related' ? 'destructive' : 'secondary'}>
                                        {query.queryType}
                                     </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(query.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            {query.orderId && (
                                <p className="text-xs font-mono bg-muted p-1 rounded-md inline-block mb-2">
                                    Order ID: {query.orderId}
                                </p>
                            )}
                            <p className="text-sm bg-muted/50 p-3 rounded-md">{query.message}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground">No contact messages found.</div>
                )}
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
