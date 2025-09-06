'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Order } from '@/types'; // You will need a detailed Order type

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';

// Helper to get badge color based on status
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Delivered': return 'default'; // Green in default theme
        case 'Shipped': return 'secondary'; // Blue-ish
        case 'Pending': return 'outline';   // Yellow-ish
        case 'Cancelled': return 'destructive';
        default: return 'secondary';
    }
};

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login?redirect=/orders');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders/me');
                if (!response.ok) throw new Error('Failed to fetch orders.');
                const data = await response.json();
                setOrders(data.orders);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user, authLoading, router]);

    if (isLoading || authLoading) {
        return <div className="flex justify-center items-center min-h-[80vh]"><LoadingSpinner size="lg" /></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 lg:py-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Orders</h1>
                <p className="text-muted-foreground mb-8">View the history of all your purchases.</p>

                {orders.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardHeader>
                            <CardTitle>No Orders Yet</CardTitle>
                            <CardDescription>Looks like you haven't placed any orders with us.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/">Start Shopping</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {orders.map((order) => (
                            <AccordionItem key={order._id} value={order._id} className="border rounded-lg bg-card">
                                <AccordionTrigger className="p-6 hover:no-underline">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 text-left">
                                        <div className="flex-1">
                                            <p className="font-bold">Order ID</p>
                                            <p className="text-sm text-muted-foreground font-mono">{order._id}</p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold">Date Placed</p>
                                            <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold">Total</p>
                                            <p className="text-sm font-semibold">₹{order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        <Badge variant={getStatusVariant(order.orderStatus)} className="ml-auto md:ml-0">{order.orderStatus}</Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-6 pt-0">
                                    <Separator className="mb-6"/>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold mb-2">Items Ordered</h4>
                                            <div className="space-y-4">
                                                {order.items.map(item => (
                                                    <div key={item.productId} className="flex gap-4">
                                                        <div className="relative h-16 w-16 rounded-md overflow-hidden border flex-shrink-0">
                                                            <Image src={item.thumbnail} alt={item.title} layout="fill" objectFit="cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{item.title}</p>
                                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} | Price: ₹{item.price.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                             <h4 className="font-semibold mb-2">Shipping Address</h4>
                                             <div className="text-sm text-muted-foreground">
                                                <p>{order.shippingAddress.addressLine}</p>
                                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipcode}</p>
                                                <p>{order.shippingAddress.country}</p>
                                             </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>
        </div>
    );
}