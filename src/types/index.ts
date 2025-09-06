// ===================================
// Database Model & Sub-document Types
// ===================================

export interface Address {
    _id: string;
    addressLine: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
}

export interface Review {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
    reviews: Review[];
    isCustomizable?: boolean;
    createdAt: string;
    updatedAt: string;
    // These are added dynamically for cart management
    customImage?: string; 
    cartItemId?: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    isAdmin: boolean;
    isVerified: boolean;
    addresses: Address[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    productId: string;
    title: string;
    quantity: number;
    price: number;
    thumbnail: string;
    customImage?: string;
}

export interface Order {
    _id: string;
    user: User; // Can be populated
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: Omit<Address, '_id'>;
    paymentStatus: 'Pending' | 'Completed' | 'Failed';
    orderStatus: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: string;
    updatedAt: string;
}

// ===================================
// Component & Context-specific Types
// ===================================

export interface CartItem {
    id: string; // This is the base product _id
    cartItemId: string; // This is a unique ID for the cart instance
    title: string;
    price: number; // Original price
    quantity: number;
    discountPercentage: number;
    discountedPrice: number; // Price per unit after discount
    thumbnail: string;
    customImage?: string;
}

export interface FilterOptions {
    category: string;
    priceRange: [number, number];
    rating: number;
    sortBy: string;
}

// ===================================
// API Response Types
// ===================================

export interface PaginationData {
    total: number;
    page: number;
    totalPages: number;
}

export interface ProductsResponse extends PaginationData {
    products: Product[];
}

export interface AdminOrdersResponse extends PaginationData {
    orders: Order[];
}

export interface Contact {
    _id: string;
    user: User; // Can be populated
    email: string;
    queryType: 'General' | 'Order Related';
    orderId?: string;
    message: string;
    createdAt: string;
    updatedAt: string;
}

export interface AnalyticsData {
    totalRevenue: number;
    orderCount: number;
    userCount: number;
    productCount: number;
    recentOrders: Order[];
    contactQueryCount: number; 
}