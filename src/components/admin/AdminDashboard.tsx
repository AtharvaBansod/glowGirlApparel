// 'use client';

// import Link from 'next/link';
// import { AnalyticsData } from '@/types';

// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from '@/components/ui/button';
// import { ArrowUpRight, IndianRupee, ShoppingCart, Users, Package } from 'lucide-react';

// interface AdminDashboardProps {
//     data: AnalyticsData;
// }

// // Helper to get badge color based on status
// const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
//     switch (status) {
//         case 'Delivered': return 'default';
//         case 'Shipped': return 'secondary';
//         case 'Pending': return 'outline';
//         case 'Cancelled': return 'destructive';
//         default: return 'secondary';
//     }
// };

// export default function AdminDashboard({ data }: AdminDashboardProps) {
//     return (
//         <div className="space-y-6">
//             {/* Stat Cards */}
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//                         <IndianRupee className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">₹{data.totalRevenue.toLocaleString('en-IN')}</div>
//                         <p className="text-xs text-muted-foreground">All-time revenue from completed orders</p>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
//                         <ShoppingCart className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">+{data.orderCount}</div>
//                         <p className="text-xs text-muted-foreground">Total orders placed on the platform</p>
//                     </CardContent>
//                 </Card>
//                  <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
//                         <Users className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">+{data.userCount}</div>
//                         <p className="text-xs text-muted-foreground">Total registered users</p>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">Products</CardTitle>
//                         <Package className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">{data.productCount}</div>
//                         <p className="text-xs text-muted-foreground">Total products in the catalog</p>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Recent Orders Table */}
//             <Card>
//                 <CardHeader className="flex flex-row items-center">
//                     <div className="grid gap-2">
//                         <CardTitle>Recent Orders</CardTitle>
//                         <CardDescription>A list of the most recent orders.</CardDescription>
//                     </div>
//                     <Button asChild size="sm" className="ml-auto gap-1">
//                         <Link href="/admin/orders">
//                             View All <ArrowUpRight className="h-4 w-4" />
//                         </Link>
//                     </Button>
//                 </CardHeader>
//                 <CardContent>
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Customer</TableHead>
//                                 <TableHead>Status</TableHead>
//                                 <TableHead className="text-right">Amount</TableHead>
//                                 <TableHead className="text-right">Date</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {data.recentOrders.map(order => (
//                                 <TableRow key={order._id}>
//                                     <TableCell>
//                                         <div className="font-medium">{order.user.name}</div>
//                                         <div className="text-sm text-muted-foreground">{order.user.email}</div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <Badge variant={getStatusVariant(order.orderStatus)}>{order.orderStatus}</Badge>
//                                     </TableCell>
//                                     <TableCell className="text-right font-medium">₹{order.totalAmount.toFixed(2)}</TableCell>
//                                     <TableCell className="text-right text-sm text-muted-foreground">
//                                         {new Date(order.createdAt).toLocaleDateString()}
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }

'use client';

import Link from 'next/link';
import { AnalyticsData, Order } from '@/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ArrowUpRight, IndianRupee, ShoppingCart, Users, Package } from 'lucide-react';
import { Separator } from '../ui/separator';

interface AdminDashboardProps {
    data: AnalyticsData;
}

// Helper to get badge color based on status
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Delivered': return 'default';
        case 'Shipped': return 'secondary';
        case 'Pending': return 'outline';
        case 'Cancelled': return 'destructive';
        default: return 'secondary';
    }
};

export default function AdminDashboard({ data }: AdminDashboardProps) {
    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{data.totalRevenue.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground">From completed orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{data.orderCount}</div>
                        <p className="text-xs text-muted-foreground">Total orders placed</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{data.userCount}</div>
                        <p className="text-xs text-muted-foreground">Total registered users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.productCount}</div>
                        <p className="text-xs text-muted-foreground">Total products in catalog</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>A list of the most recent orders.</CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="/admin/orders">
                            View All <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* --- DESKTOP TABLE (Hidden on mobile) --- */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.recentOrders.map(order => (
                                    <TableRow key={order._id}>
                                        <TableCell>
                                            <div className="font-medium">{order.user.name}</div>
                                            <div className="text-sm text-muted-foreground">{order.user.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(order.orderStatus)}>{order.orderStatus}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">₹{order.totalAmount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* --- MOBILE CARD LIST (Hidden on desktop) --- */}
                    <div className="space-y-4 md:hidden">
                        {data.recentOrders.map(order => (
                            <div key={order._id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold">{order.user.name}</p>
                                        <p className="text-sm text-muted-foreground">{order.user.email}</p>
                                    </div>
                                    <Badge variant={getStatusVariant(order.orderStatus)}>{order.orderStatus}</Badge>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span className="font-medium">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
