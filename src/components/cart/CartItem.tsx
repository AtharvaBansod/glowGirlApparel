'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.cartItemId);
      toast.success(`${item.title} removed from cart.`);
    } else {
      updateQuantity(item.cartItemId, newQuantity);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.cartItemId);
    toast.success(`${item.title} removed from cart.`);
  }

  return (
    <div className="flex items-center space-x-4 py-3">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover"
          sizes="80px"
        />
        {item.customImage && (
          <div className="absolute inset-0 flex items-center justify-center p-3 pointer-events-none">
             <Image
                src={item.customImage}
                alt="Custom design"
                fill
                className="object-contain"
                sizes="64px"
              />
          </div>
        )}
      </div>
      
      {/* This central div will now grow and shrink properly */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold line-clamp-2">{item.title}</h4>
        {item.customImage && <p className="text-xs text-pink-500 font-medium">Custom Print</p>}
        <p className="text-sm text-muted-foreground">
          ₹{item.discountedPrice.toFixed(2)}
        </p>
        <div className="flex items-center space-x-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="h-6 w-6 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-6 text-center">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* This div has a fixed width to prevent it from squishing */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0 w-20">
         <p className="text-sm font-semibold text-right">₹{(item.discountedPrice * item.quantity).toFixed(2)}</p>
         <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
      </div>
    </div>
  );
};
