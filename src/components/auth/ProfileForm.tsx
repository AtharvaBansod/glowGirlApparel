'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Address } from '@/types';

import { useApiContext } from '@/contexts/ApiContext';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { PlusCircle, Home } from 'lucide-react';

interface ProfileFormProps {
    user: User;
}

const initialAddressState: Omit<Address, '_id'> = {
    addressLine: '', city: '', state: '', zipcode: '', country: 'India'
};

export default function ProfileForm({ user: initialUser }: ProfileFormProps) {
    const router = useRouter();
    const { updateUserProfile } = useApiContext();

    // Local state for the user to allow for updates
    const [user, setUser] = useState(initialUser);

    const [profile, setProfile] = useState({ name: user.name, mobile: user.mobile });
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState(initialAddressState);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    
    // Keep local state in sync if the prop changes
    useEffect(() => {
        setUser(initialUser);
        setProfile({ name: initialUser.name, mobile: initialUser.mobile });
    }, [initialUser]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e: FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const { user: updatedUser } = await updateUserProfile({ name: profile.name, mobile: profile.mobile });
            setUser(updatedUser); // Update local state with the response
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSavingProfile(false);
        }
    };
    
    const handleAddAddress = async (e: FormEvent) => {
        e.preventDefault();
        setIsAddingAddress(true);
        try {
            const { user: updatedUser } = await updateUserProfile({ newAddress });
            setUser(updatedUser); // Update local state with the new address list
            toast.success("Address added successfully!");
            setNewAddress(initialAddressState);
            setIsAddressDialogOpen(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsAddingAddress(false);
        }
    };

    return (
        <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Profile Details</TabsTrigger>
                <TabsTrigger value="addresses">My Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your name and contact details here.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleProfileUpdate}>
                        <CardContent className="space-y-4 mb-5">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" value={profile.name} onChange={handleProfileChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={user.email} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile Number</Label>
                                <Input id="mobile" name="mobile" value={profile.mobile} onChange={handleProfileChange} required />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isSavingProfile}>
                                {isSavingProfile ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>

            <TabsContent value="addresses">
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Addresses</CardTitle>
                        <CardDescription>Manage your saved addresses for faster checkout.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                           {(user.addresses || []).map(addr => (
                               <div key={addr._id} className="p-4 border rounded-md flex items-start gap-4">
                                   <Home className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                                   <div>
                                       <p className="font-medium">{addr.addressLine}</p>
                                       <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.zipcode}</p>
                                   </div>
                               </div>
                           ))}
                           {(!user.addresses || user.addresses.length === 0) && (
                                <p className="text-sm text-muted-foreground text-center py-4">You have no saved addresses.</p>
                           )}
                        </div>
                         <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full mt-4">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={handleAddAddress}>
                                    <DialogHeader>
                                        <DialogTitle>Add a new address</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="addressLine">Address Line</Label>
                                            <Input id="addressLine" name="addressLine" value={newAddress.addressLine} onChange={handleAddressChange} required />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input id="city" name="city" value={newAddress.city} onChange={handleAddressChange} required />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input id="state" name="state" value={newAddress.state} onChange={handleAddressChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zipcode">Zip Code</Label>
                                            <Input id="zipcode" name="zipcode" value={newAddress.zipcode} onChange={handleAddressChange} required />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={isAddingAddress}>
                                            {isAddingAddress ? <LoadingSpinner size="sm" /> : 'Save Address'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
