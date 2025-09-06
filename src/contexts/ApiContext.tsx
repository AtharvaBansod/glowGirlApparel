'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { 
    Product, 
    ProductsResponse, 
    FilterOptions,
    Order,
    User,
    AnalyticsData,
    AdminOrdersResponse
} from '@/types';

// A helper to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'An API error occurred');
    }
    return data;
}

interface ApiContextType {
    // Product APIs
    fetchProducts: (page?: number, limit?: number, query?: string) => Promise<ProductsResponse>;
    fetchProductById: (id: string) => Promise<Product>;
    fetchProductsByCategory: (category: string) => Promise<ProductsResponse>;
    fetchCategories: () => Promise<string[]>;
    fetchCustomizableProducts: () => Promise<ProductsResponse>;
    submitReview: (productId: string, review: { rating: number; comment: string }) => Promise<Product>;
    
    // User & Order APIs
    getUserProfile: () => Promise<{ user: User }>;
    updateUserProfile: (data: { name?: string; mobile?: string; newAddress?: object }) => Promise<{ user: User }>;
    createOrder: (orderData: object) => Promise<{ order: Order }>;
    getUserOrders: () => Promise<{ orders: Order[] }>;
    submitContactForm: (formData: object) => Promise<{ message: string }>;

    // Admin APIs
    getAdminAnalytics: () => Promise<AnalyticsData>;
    getAdminOrders: (page?: number, status?: string | null) => Promise<AdminOrdersResponse>;
    updateOrderStatus: (orderId: string, status: string) => Promise<{ order: Order }>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApiContext = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApiContext must be used within an ApiProvider');
    }
    return context;
};

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    // useCallback ensures these functions are not recreated on every render
    
    // --- PRODUCT FUNCTIONS ---
    const fetchProducts = useCallback(async (page = 1, limit = 12, query = ''): Promise<ProductsResponse> => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), query });
        const response = await fetch(`/api/products?${params.toString()}`);
        return handleResponse<ProductsResponse>(response);
    }, []);

    const fetchProductById = useCallback(async (id: string): Promise<Product> => {
        const response = await fetch(`/api/products/${id}`);
        return handleResponse<Product>(response);
    }, []);

    const fetchProductsByCategory = useCallback(async (category: string): Promise<ProductsResponse> => {
        const response = await fetch(`/api/products/category/${category}`);
        return handleResponse<ProductsResponse>(response);
    }, []);

    const fetchCategories = useCallback(async (): Promise<string[]> => {
        const response = await fetch('/api/categories');
        return handleResponse<string[]>(response);
    }, []);

    const fetchCustomizableProducts = useCallback(async (): Promise<ProductsResponse> => {
        // This requires a new API route: /api/products/customizable
        const response = await fetch('/api/products/customizable'); 
        return handleResponse<ProductsResponse>(response);
    }, []);

    const submitReview = useCallback(async (productId: string, review: { rating: number; comment: string }): Promise<Product> => {
        const response = await fetch(`/api/products/${productId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        });
        const data = await handleResponse<{ product: Product }>(response);
        return data.product;
    }, []);

    // --- USER & ORDER FUNCTIONS ---
    const getUserProfile = useCallback(async (): Promise<{ user: User }> => {
        const response = await fetch('/api/users/profile');
        return handleResponse<{ user: User }>(response);
    }, []);

    const updateUserProfile = useCallback(async (updateData: object): Promise<{ user: User }> => {
        const response = await fetch('/api/users/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });
        return handleResponse<{ user: User }>(response);
    }, []);

    const createOrder = useCallback(async (orderData: object): Promise<{ order: Order }> => {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        return handleResponse<{ order: Order }>(response);
    }, []);

    const getUserOrders = useCallback(async (): Promise<{ orders: Order[] }> => {
        const response = await fetch('/api/orders/me');
        return handleResponse<{ orders: Order[] }>(response);
    }, []);
    
    const submitContactForm = useCallback(async (formData: object): Promise<{ message: string }> => {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        return handleResponse<{ message: string }>(response);
    }, []);

    // --- ADMIN FUNCTIONS ---
    const getAdminAnalytics = useCallback(async (): Promise<AnalyticsData> => {
        const response = await fetch('/api/admin/analytics');
        return handleResponse<AnalyticsData>(response);
    }, []);

    const getAdminOrders = useCallback(async (page = 1, status: string | null = null): Promise<AdminOrdersResponse> => {
        const params = new URLSearchParams({ page: page.toString() });
        if(status) params.append('status', status);
        const response = await fetch(`/api/admin/orders?${params.toString()}`);
        return handleResponse<AdminOrdersResponse>(response);
    }, []);

    const updateOrderStatus = useCallback(async (orderId: string, status: string): Promise<{ order: Order }> => {
        const response = await fetch('/api/admin/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status }),
        });
        return handleResponse<{ order: Order }>(response);
    }, []);


    const value: ApiContextType = {
        fetchProducts, fetchProductById, fetchProductsByCategory, fetchCategories, fetchCustomizableProducts, submitReview,
        getUserProfile, updateUserProfile, createOrder, getUserOrders, submitContactForm,
        getAdminAnalytics, getAdminOrders, updateOrderStatus
    };

    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};