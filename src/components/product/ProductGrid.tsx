'use client';

import { ProductCard } from './ProductCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export const ProductGrid = ({ products, loading = false }: ProductGridProps) => {
  // Case 1: Initial loading state with no products yet displayed
  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Case 2: Loading has finished, but no products were found (e.g., after filtering)
  if (!loading && products.length === 0) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[400px] text-center bg-muted/50 rounded-lg">
            <h3 className="text-xl font-semibold">No Products Found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
        </div>
    );
  }

  // Case 3: Products are available to display
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
};