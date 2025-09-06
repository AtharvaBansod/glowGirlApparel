'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard = ({ product, index }: ProductCardProps) => {
  const { addToCart, isInCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  // Safer discount calculation
  const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    try {
        await toast.promise(
            addToCart(product),
            {
                loading: 'Adding to cart...',
                success: <b>{product.title} added!</b>,
                error: (err) => <b>{err.toString()}</b>,
            }
        );
    } catch (error) {
        // Toast promise will handle showing the error
    } finally {
        setIsLoading(false);
    }
  };

  const isAlreadyInCart = isInCart(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link href={`/product/${product._id}`} className="h-full block group">
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {(product.discountPercentage || 0) > 0 && (
              <Badge className="absolute top-2 left-2 bg-pink-500 text-white border-pink-500">
                -{Math.round(product.discountPercentage || 0)}%
              </Badge>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <Badge variant="secondary" className="absolute top-2 right-2">
                Only {product.stock} left
              </Badge>
            )}
             {product.stock === 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}
          </div>

          <CardContent className="flex-1 p-4 flex flex-col">
            <h3 className="font-semibold line-clamp-2 mb-2 flex-grow">{product.title}</h3>
            
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">₹{discountedPrice.toFixed(2)}</span>
              {(product.discountPercentage || 0) > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button
              onClick={handleAddToCart}
              disabled={isLoading || product.stock === 0 || isAlreadyInCart}
              className="w-full"
              size="sm"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : isAlreadyInCart ? (
                <>
                  <Check className="h-4 w-4 mr-2" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};
