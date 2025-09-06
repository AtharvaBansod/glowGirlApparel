// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useDebounce } from '@/hooks/useDebounce';
// import { AnimatePresence, motion } from 'framer-motion';

// // Contexts
// import { useCart } from '@/contexts/CartContext';
// import { useTheme } from '@/contexts/ThemeContext';
// import { useAuth } from '@/contexts/AuthContext';

// // UI Components
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { CartSheet } from '@/components/cart/CartSheet';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Separator } from '@/components/ui/separator';

// // Icons
// import { ShoppingCart, Search, Moon, Sun, Menu, User as UserIcon, LogOut, LayoutDashboard, ShoppingBag, UserCircle, X } from 'lucide-react';

// export const Navbar = () => {
//     const { totalItems } = useCart();
//     const { isDark, toggleDark } = useTheme();
//     const { user, loading: authLoading, logout } = useAuth();
//     const router = useRouter();

//     const [searchQuery, setSearchQuery] = useState('');
//     const debouncedSearch = useDebounce(searchQuery, 300);
//     const [isMounted, setIsMounted] = useState(false);
    
//     // State for the new user menu panel
//     const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//     const userMenuRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         setIsMounted(true);
//         // Effect to close the menu if clicking outside of it
//         const handleClickOutside = (event: MouseEvent) => {
//             if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
//                 setIsUserMenuOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const handleSearchSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (searchQuery.trim()) {
//             router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//             setSearchQuery('');
//         }
//     };

//     return (
//         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//             <div className="container mx-auto flex h-16 items-center justify-between px-4">
//                 {/* Left Side */}
//                 <div className="flex items-center">
//                     <div className="md:hidden">
//                         <Sheet>
//                             <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button></SheetTrigger>
//                             <SheetContent side="left" className="w-64"><SheetHeader><SheetTitle>Menu</SheetTitle></SheetHeader><nav className="grid gap-4 py-4"><SheetClose asChild><Link href="/" className="text-lg font-medium">Home</Link></SheetClose><SheetClose asChild><Link href="/about" className="text-lg font-medium">About</Link></SheetClose><SheetClose asChild><Link href="/contact" className="text-lg font-medium">Contact</Link></SheetClose></nav></SheetContent>
//                         </Sheet>
//                     </div>
//                     <div className="hidden md:flex items-center gap-6">
//                         <Link href="/" className="flex items-center gap-2"><ShoppingBag className="h-6 w-6 text-pink-500" /><span className="font-bold text-lg">Glow Girl Apparel</span></Link>
//                         <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground"><Link href="/about" className="hover:text-primary transition-colors">About</Link><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></nav>
//                     </div>
//                 </div>

//                 {/* Center Logo on Mobile */}
//                 <div className="md:hidden"><Link href="/" className="flex items-center gap-2"><ShoppingBag className="h-6 w-6 text-pink-500" /><span className="font-bold">Glow Girl</span></Link></div>

//                 {/* Right Side */}
//                 <div className="flex items-center gap-2">
//                     <form onSubmit={handleSearchSubmit} className="hidden sm:block relative">
//                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="search" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 sm:w-40 md:w-56" />
//                     </form>
//                     <Button variant="ghost" size="icon" onClick={toggleDark}>{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</Button>
//                     <Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="relative"><ShoppingCart className="h-5 w-5" />{isMounted && totalItems > 0 && (<Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">{totalItems}</Badge>)}</Button></SheetTrigger><SheetContent className="w-[400px] sm:max-w-md"><SheetHeader><SheetTitle className='mx-12'>Your Cart ({totalItems})</SheetTitle></SheetHeader><CartSheet /></SheetContent></Sheet>

//                     {/* --- NEW USER AUTH SECTION --- */}
//                     <div className="relative" ref={userMenuRef}>
//                         {(!isMounted || authLoading) ? (
//                             <Skeleton className="h-8 w-8 rounded-full" />
//                         ) : user ? (
//                             <Button onClick={() => setIsUserMenuOpen(prev => !prev)} variant="ghost" className="relative h-8 w-8 rounded-full">
//                                 <Avatar className="h-8 w-8"><AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
//                             </Button>
//                         ) : (
//                             <Button variant="ghost" size="icon" asChild><Link href="/login"><UserIcon className="h-5 w-5" /></Link></Button>
//                         )}

//                         <AnimatePresence>
//                             {isUserMenuOpen && user && (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: -10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -10 }}
//                                     transition={{ duration: 0.2 }}
//                                     className="absolute top-12 right-0 w-64 bg-background border rounded-md shadow-lg z-[99]"
//                                 >
//                                     <div className="p-4 border-b">
//                                         <p className="font-semibold">Hi, {user.name}!</p>
//                                         <p className="text-sm text-muted-foreground">{user.email}</p>
//                                     </div>
//                                     <nav className="p-2">
//                                         <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center w-full p-2 text-sm rounded-md hover:bg-accent"><UserCircle className="mr-2 h-4 w-4"/>Profile</Link>
//                                         <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center w-full p-2 text-sm rounded-md hover:bg-accent"><ShoppingBag className="mr-2 h-4 w-4"/>My Orders</Link>
//                                         {user.isAdmin && (
//                                             <>
//                                                 <Separator className="my-2"/>
//                                                 <Link href="/admin/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center w-full p-2 text-sm rounded-md hover:bg-accent"><LayoutDashboard className="mr-2 h-4 w-4"/>Admin Panel</Link>
//                                             </>
//                                         )}
//                                         <Separator className="my-2"/>
//                                         <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="flex items-center w-full p-2 text-sm rounded-md hover:bg-accent text-red-500"><LogOut className="mr-2 h-4 w-4"/>Logout</button>
//                                     </nav>
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </div>
//                 </div>
//             </div>
//         </header>
//     );
// };



'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';

// Contexts
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CartSheet } from '@/components/cart/CartSheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// Icons
import { ShoppingCart, Search, Moon, Sun, Menu, User as UserIcon, LogOut, LayoutDashboard, ShoppingBag, UserCircle, X } from 'lucide-react';

export const Navbar = () => {
    const { totalItems } = useCart();
    const { isDark, toggleDark } = useTheme();
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userMenuRef]);


    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="overflow-visible sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
            <div className="container mx-auto flex h-16 items-center justify-between px-2 gap-2">
                {/* Left Side: Desktop Nav & Mobile Menu */}
                <div className="flex items-center gap-6">
                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64">
                                <SheetHeader className="text-center">
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col items-center gap-4 py-6">
                                    <SheetClose asChild>
                                        <Link href="/" className="py-2 text-lg font-medium hover:text-primary transition-colors">Home</Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="/about" className="py-2 text-lg font-medium hover:text-primary transition-colors">About</Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="/contact" className="py-2 text-lg font-medium hover:text-primary transition-colors">Contact</Link>
                                    </SheetClose>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                    {/* Desktop Logo & Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <ShoppingBag className="h-6 w-6 text-pink-500" />
                            <span className="font-bold text-lg">Glow Girl Apparel</span>
                        </Link>
                        <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                        </nav>
                    </div>
                </div>

                {/* Center: Search Bar on Desktop, Logo on Mobile */}
                <div className="flex-1 flex justify-center md:px-8">
                    {/* Mobile Logo */}
                    <div className="md:hidden">
                        <Link href="/" className="flex items-center gap-2">
                            <ShoppingBag className="h-6 w-6 text-pink-500" />
                            <span className="font-bold">Glow Girl Apparel</span>
                        </Link>
                    </div>
                    {/* Desktop Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="hidden md:block w-full max-w-sm relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-full"
                        />
                    </form>
                </div>

                {/* Right side: Icons & Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleDark}>
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {isMounted && totalItems > 0 && (
                                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">{totalItems}</Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:max-w-md">
                            <SheetHeader><SheetTitle>Your Cart ({totalItems})</SheetTitle></SheetHeader>
                            <CartSheet />
                        </SheetContent>
                    </Sheet>

                    {/* User Auth Section */}
                    <div className="relative" ref={userMenuRef}>
                        {(!isMounted || authLoading) ? (
                            <Skeleton className="h-8 w-8 rounded-full" />
                        ) : user ? (
                            <>
                                <Button onClick={() => setIsUserMenuOpen(prev => !prev)} variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-12 right-0 w-64 bg-background border rounded-md shadow-lg z-[99]"
                                        >
                                            <div className="p-4 border-b">
                                                <p className="font-semibold">Hi, {user.name}!</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                            <nav className="p-2">
                                                <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center w-full p-2 text-sm rounded-md hover:bg-accent"><UserCircle className="mr-2 h-4 w-4"/>Profile</Link>
                                                <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center w-full p-2 text-sm rounded-md hover:bg-accent"><ShoppingBag className="mr-2 h-4 w-4"/>My Orders</Link>
                                                {user.isAdmin && (
                                                    <>
                                                        <Separator className="my-2"/>
                                                        <Link href="/admin/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center w-full p-2 text-sm rounded-md hover:bg-accent"><LayoutDashboard className="mr-2 h-4 w-4"/>Admin Panel</Link>
                                                    </>
                                                )}
                                                <Separator className="my-2"/>
                                                <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="flex items-center w-full p-2 text-sm rounded-md hover:bg-accent text-red-500"><LogOut className="mr-2 h-4 w-4"/>Logout</button>
                                            </nav>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/login"><UserIcon className="h-5 w-5" /></Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

