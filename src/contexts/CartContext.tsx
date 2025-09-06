'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  isInCart: (productId: string) => boolean;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to get cart from localStorage safely
const getInitialCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    try {
        const item = window.localStorage.getItem('glow-girl-cart');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        return [];
    }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);

  // Effect to save cart to localStorage whenever it changes
  useEffect(() => {
    try {
        window.localStorage.setItem('glow-girl-cart', JSON.stringify(cartItems));
    } catch (error) {
        console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);
  
  const addToCart = async (product: Product, quantityToAdd = 1): Promise<void> => {
    // Note: A stock check API would be called here in a real-world scenario.
    // For this implementation, we rely on the stock check on the final order creation.
    // Example: await fetch('/api/products/check-stock', { method: 'POST', body: JSON.stringify({ productId: product._id, quantity: quantityToAdd }) });
    
    return new Promise((resolve) => {
        setCartItems(prev => {
            // For non-custom items, check if it already exists to increment quantity
            if (!product.customImage) {
                const existingItem = prev.find(item => item.id === product._id && !item.customImage);
                if (existingItem) {
                    return prev.map(item =>
                        item.cartItemId === existingItem.cartItemId
                            ? { ...item, quantity: item.quantity + quantityToAdd }
                            : item
                    );
                }
            }
            
            // For new items or custom items, add as a new line
            const discountedPrice = product.price * (1 - product.discountPercentage / 100);
            const newItem: CartItem = {
                id: product._id,
                cartItemId: product.cartItemId || `${product._id}-${Date.now()}`,
                title: product.title,
                price: product.price,
                quantity: quantityToAdd,
                discountPercentage: product.discountPercentage,
                discountedPrice: discountedPrice,
                thumbnail: product.thumbnail,
                customImage: product.customImage,
            };
            return [...prev, newItem];
        });
        resolve();
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const isInCart = (productId: string) => {
    // Checks if any non-custom version of the product is in the cart
    return cartItems.some(item => item.id === productId && !item.customImage);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0), [cartItems]);

  const value = {
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    isInCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};