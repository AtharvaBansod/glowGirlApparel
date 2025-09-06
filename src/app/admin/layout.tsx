import Link from 'next/link';
import { ReactNode } from 'react';
import { LayoutDashboard, ShoppingCart, Users, MessageSquare } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav'; // A client component for active links

/**
 * Defines the shared layout for the admin section.
 * It includes a sidebar for navigation and a main content area.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-muted/40">
            {/* Sidebar Navigation */}
            <aside className="hidden md:flex md:w-64 flex-col border-r bg-background">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                        <span className="text-lg">Glow Girl - Admin</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-4">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <AdminNav />
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
                {/* Mobile Header (Optional but good practice) */}
                <header className="md:hidden sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-6 z-10">
                    <h1 className="font-semibold text-lg">Admin Menu</h1>
                </header>
                
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}