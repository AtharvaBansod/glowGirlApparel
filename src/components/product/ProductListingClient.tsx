'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product, FilterOptions } from '@/types';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const ITEMS_PER_PAGE = 12;

interface ProductListingProps {
    initialProducts: Product[];
    categories: string[];
}

export default function ProductListingClient({ initialProducts, categories }: ProductListingProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<FilterOptions>({
        category: '',
        priceRange: [0, 3000], // --- FIX: Increased default max price ---
        rating: 0,
        sortBy: 'default',
    });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const filteredProducts = useMemo(() => {
        let filtered = [...initialProducts];

        if (filters.category) {
            filtered = filtered.filter(p => p.category === filters.category);
        }

        filtered = filtered.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

        if (filters.rating > 0) {
            filtered = filtered.filter(p => p.rating >= filters.rating);
        }

        switch (filters.sortBy) {
            case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
            case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
            case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
            case 'name': filtered.sort((a, b) => a.title.localeCompare(b.title)); break;
        }
        
        return filtered;
    }, [initialProducts, filters]);

    // Reset page to 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredProducts.slice(start, end);
    }, [currentPage, filteredProducts]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const handleFiltersChange = (newFilters: FilterOptions) => setFilters(newFilters);
    const handleClearFilters = () => setFilters({ category: '', priceRange: [0, 3000], rating: 0, sortBy: 'default' });
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <div className="hidden lg:block w-80">
                <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} categories={categories} />
            </div>

            {/* Mobile Filters */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filters</Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                         <SheetHeader><SheetTitle>Product Filters</SheetTitle></SheetHeader>
                        <div className="p-4">
                            <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} categories={categories}/>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex-1">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Our Collection</h2>
                    <p className="text-muted-foreground">{filteredProducts.length} products found</p>
                </div>

                <ProductGrid products={paginatedProducts} />

                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>
        </div>
    );
}
