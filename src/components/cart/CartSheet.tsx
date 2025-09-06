'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CartItem } from './CartItem';
import { ShoppingBag } from 'lucide-react';
import { SheetClose } from '@/components/ui/sheet'; // Import SheetClose

export const CartSheet = () => {
  const { cartItems, totalItems, clearCart, totalPrice } = useCart();

  return (
    // Add horizontal padding to the root container of the component
    <div className="h-full flex flex-col ">
      {/* Main content area that will grow to fill available space */}
      {/* Use negative margins to counteract the padding and allow the scrollbar to sit at the edge */}
      <div className="flex-1 overflow-y-auto"> 
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <ShoppingBag className="h-20 w-20 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Looks like you haven't added anything yet.
            </p>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          // Add the horizontal padding back inside the scrollable area for the content
          <ScrollArea className="h-full px-3">
            <div className="flex flex-col gap-2 px-12">
              {cartItems.map(item => (
                <CartItem key={item.cartItemId} item={item} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      
      {/* Footer section that will always be at the bottom */}
      {/* Use negative margins here as well to make the top border stretch full-width */}
      {cartItems.length > 0 && (
        <div className="border-t pt-4 mt-auto mb-2 mx-12">
            <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="font-medium">{totalItems}</span>
                </div>
                 <div className="flex justify-between items-center font-semibold text-base">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <Separator className="my-4" />
          
            <div className="space-y-2">
                <SheetClose asChild>
                  <Button asChild className="w-full" size="lg">
                      <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
                 <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={clearCart}
                  >
                    Clear Cart
                </Button>
            </div>
        </div>
      )}
    </div>
  );
};

