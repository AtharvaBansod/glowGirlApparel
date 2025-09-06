'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Separator } from '@/components/ui/separator';
import { Address } from '@/types';

export default function CheckoutPage() {
    const { user, loading: authLoading } = useAuth();
    const { cartItems, totalPrice, clearCart } = useCart();
    const router = useRouter();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Redirect if not logged in or cart is empty
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.replace('/login?redirect=/checkout');
            } else if (cartItems.length === 0) {
                toast.error("Your cart is empty.");
                router.replace('/');
            }
        }
    }, [user, authLoading, cartItems, router]);

    // Fetch user's addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await fetch('/api/users/profile');
                if (!response.ok) throw new Error('Failed to fetch addresses.');
                const data = await response.json();
                setAddresses(data.user.addresses || []);
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error("Please select a shipping address.");
            return;
        }

        const shippingAddress = addresses.find(addr => addr._id === selectedAddress);
        if (!shippingAddress) {
            toast.error("Invalid address selected.");
            return;
        }
        
        setIsPlacingOrder(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        productId: item.id, // Assuming cart item id is the product ObjectId
                        title: item.title,
                        quantity: item.quantity,
                        price: item.price,
                        thumbnail: item.thumbnail,
                        customImage: item.customImage // Handle custom print orders
                    })),
                    totalAmount: totalPrice,
                    shippingAddress,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to place order.');
            }
            
            toast.success('Order placed successfully!');
            clearCart();
            router.push('/orders');

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (authLoading || isLoading) {
        return <div className="flex justify-center items-center min-h-[80vh]"><LoadingSpinner size="lg" /></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 lg:py-16">
            <h1 className="text-3xl font-extrabold tracking-tight text-center mb-10">Checkout</h1>
            <div className="grid lg:grid-cols-2 gap-12">
                {/* Left Column: Shipping & Payment */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                            <CardDescription>Select where you want to receive your order.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {addresses.length > 0 ? (
                                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                                    {addresses.map(addr => (
                                        <Label key={addr._id} htmlFor={addr._id} className="flex items-start space-x-4 p-4 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                            <RadioGroupItem value={addr._id} id={addr._id} />
                                            <div>
                                                <p className="font-semibold">{addr.addressLine}</p>
                                                <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.zipcode}</p>
                                                <p className="text-sm text-muted-foreground">{addr.country}</p>
                                            </div>
                                        </Label>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <p className="text-muted-foreground">You have no saved addresses.</p>
                            )}
                            <Button variant="outline" asChild className="mt-4 w-full">
                                <Link href="/profile">Add or Manage Addresses</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                         <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                            <CardDescription>All transactions are secure and encrypted.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="p-4 border-2 border-dashed rounded-lg">
                                <h3 className="font-semibold">Pay with UPI</h3>
                                <p className="text-sm text-muted-foreground mb-4">Scan the QR code with any UPI app.</p>
                                <div className="flex justify-center">
                                    <div className="p-2 bg-white rounded-md">
                                       <Image src="/placeholder-qr.svg" alt="UPI QR Code" width={150} height={150} />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Mock Payment UI</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Order Summary */}
                <div>
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                                <Image src={item.thumbnail} alt={item.title} layout="fill" objectFit="cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold line-clamp-1">{item.title}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">₹{(item.discountedPrice * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-6" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Subtotal</p>
                                    <p>₹{totalPrice.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Taxes & Fees</p>
                                    <p>Calculated at next step</p>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-lg">
                                    <p>Total</p>
                                    <p>₹{totalPrice.toFixed(2)}</p>
                                </div>
                            </div>
                            <Button className="w-full mt-6" size="lg" disabled={isPlacingOrder || !selectedAddress} onClick={handlePlaceOrder}>
                                {isPlacingOrder ? <LoadingSpinner /> : 'Place Order'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}