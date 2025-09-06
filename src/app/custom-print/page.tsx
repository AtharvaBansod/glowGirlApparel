'use client';

import { useState, useEffect, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';
import toast from 'react-hot-toast';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardDescription } from '@/components/ui/card';
import { Upload, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function CustomPrintPage() {
    const { addToCart } = useCart();

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Step 1: Fetch customizable products
    useEffect(() => {
        const fetchCustomizableProducts = async () => {
            try {
                // This API route will need to be created. It should filter for `isCustomizable: true`.
                const response = await fetch('/api/products/customizable'); 
                if (!response.ok) throw new Error('Could not fetch products.');
                const data = await response.json();
                setProducts(data.products);
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCustomizableProducts();
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string); // result is base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddToCart = () => {
        if (!selectedProduct || !uploadedImage) {
            toast.error("Please upload a design first.");
            return;
        }

        // Add the custom image data to the product before adding to cart
        const customProduct = {
            ...selectedProduct,
            customImage: uploadedImage,
            // Create a unique ID for the cart item to distinguish between different custom versions of the same product
            cartItemId: `${selectedProduct._id}-${Date.now()}`, 
        };
        
        toast.promise(addToCart(customProduct), {
            loading: 'Adding custom item to cart...',
            success: <b>{customProduct.title} added!</b>,
            error: <b>Could not add item.</b>,
        });

        // Reset for next creation
        setSelectedProduct(null);
        setUploadedImage(null);
    };

    // UI for Step 1: Product Selection
    if (!selectedProduct) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-extrabold text-center mb-2">Start Your Creation</h1>
                <p className="text-lg text-muted-foreground text-center mb-8">Step 1: Choose your canvas</p>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <Card key={product._id} onClick={() => setSelectedProduct(product)} className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group">
                                <div className="relative aspect-square w-full">
                                    <Image src={product.thumbnail} alt={product.title} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold">{product.title}</h3>
                                    <CardDescription>Starts at ₹{product.price.toFixed(2)}</CardDescription>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // UI for Step 2: Customization
    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="outline" onClick={() => setSelectedProduct(null)} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4"/> Back to Apparel Selection
            </Button>
            <div className="grid lg:grid-cols-2 gap-12">
                {/* Preview Column */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Live Preview</h2>
                    <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border">
                        <Image src={selectedProduct.thumbnail} alt={selectedProduct.title} layout="fill" objectFit="contain" className="opacity-80" />
                        {uploadedImage && (
                            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 flex items-center justify-center pointer-events-none">
                                <Image src={uploadedImage} alt="Custom design preview" layout="fill" objectFit="contain" />
                            </div>
                        )}
                         {!uploadedImage && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-muted-foreground">Your design will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* Controls Column */}
                <div className="flex flex-col justify-center">
                    <p className="text-muted-foreground">You're customizing</p>
                    <h1 className="text-4xl font-extrabold mb-4">{selectedProduct.title}</h1>
                    <p className="text-muted-foreground mb-8">{selectedProduct.description}</p>
                    <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <Button size="lg" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-5 w-5"/> {uploadedImage ? 'Change Design' : 'Upload Your Design'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">Supports PNG, JPG, WEBP formats.</p>

                    <Separator className="my-8" />
                    
                    <Button size="lg" disabled={!uploadedImage} onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700">
                        <ShoppingCart className="mr-2 h-5 w-5"/> Add to Cart
                    </Button>
                    {!uploadedImage && <p className="text-sm text-red-500 mt-2 text-center">Please upload a design to add to cart.</p>}
                </div>
            </div>
        </div>
    );
}