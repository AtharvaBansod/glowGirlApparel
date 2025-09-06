'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useApiContext } from '@/contexts/ApiContext';
import { Product as ProductType } from '@/types';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronLeft, ShoppingCart } from 'lucide-react';

interface ProductDetailsClientProps {
    initialProduct: ProductType;
    similarProducts: ProductType[];
}

export default function ProductDetailsClient({ initialProduct, similarProducts }: ProductDetailsClientProps) {
    const router = useRouter();
    const { addToCart, isInCart } = useCart();
    const { submitReview } = useApiContext();
    const { user } = useAuth();

    const [product, setProduct] = useState<ProductType>(initialProduct);
    const [selectedImage, setSelectedImage] = useState(0);
    
    // State for review submission
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Reset component state if navigating between similar products
    useEffect(() => {
        setProduct(initialProduct);
        setSelectedImage(0);
        setUserRating(0);
        setComment('');
    }, [initialProduct]);

    const handleAddToCart = () => {
        toast.promise(
            addToCart(product),
            {
                loading: 'Adding to cart...',
                success: <b>{product.title} added!</b>,
                error: (err) => <b>{err.message || 'Could not add item.'}</b>,
            }
        );
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please log in to submit a review.");
            router.push('/login');
            return;
        }
        if (userRating === 0) {
            toast.error("Please select a star rating.");
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedProduct = await submitReview(product._id, {
                rating: userRating,
                comment: comment.trim(),
            });
            setProduct(updatedProduct); 
            toast.success("Thank you for your review!");
            setComment('');
            setUserRating(0);
        } catch (error: any) {
            toast.error(error.message || "Failed to submit review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const discountedPrice = product.price * (1 - product.discountPercentage / 100);
    const averageRating = product.rating;
    const reviewCount = product.reviews?.length || 0;

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            <Button variant="outline" onClick={() => router.back()} className="mb-8">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
            
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Gallery */}
                <div>
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden border mb-4">
                        <Image
                            src={product.images?.[selectedImage] || product.thumbnail}
                            alt={product.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {product.images?.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`relative aspect-square rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                            >
                                <Image src={image} alt={`${product.title} thumbnail ${index + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div>
                    <Badge variant="secondary">{product.category.replace(/-/g, ' ')}</Badge>
                    <h1 className="text-3xl lg:text-4xl font-bold my-2">{product.title}</h1>
                    
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {averageRating.toFixed(1)} ({reviewCount} reviews)
                        </span>
                    </div>

                    <p className="text-muted-foreground mb-6">{product.description}</p>
                    
                    <div className="mb-6">
                        <div className="flex items-baseline gap-4 mb-2">
                            <span className="text-3xl font-bold text-primary">₹{discountedPrice.toFixed(2)}</span>
                            {product.discountPercentage > 0 && (
                                <span className="text-xl text-muted-foreground line-through">₹{product.price.toFixed(2)}</span>
                            )}
                        </div>
                        {product.stock > 0 ? (
                            <p className="text-green-600 font-semibold">In Stock ({product.stock} available)</p>
                        ) : (
                            <p className="text-red-500 font-semibold">Out of Stock</p>
                        )}
                    </div>

                    <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.stock === 0 || isInCart(product._id)}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {isInCart(product._id) ? 'Added to Cart' : 'Add to Cart'}
                    </Button>
                </div>
            </div>

            <Separator className="my-12" />

            {/* Reviews Section */}
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                     <h2 className="text-2xl font-bold mb-6">Customer Reviews ({reviewCount})</h2>
                     {reviewCount > 0 ? (
                        <div className="space-y-6">
                            {product.reviews.map((review, index) => (
                                <div key={index} className="border-b pb-6 last:border-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}/>
                                        ))}
                                        <span className="font-semibold ml-2">{review.reviewerName}</span>
                                    </div>
                                    <p className="text-muted-foreground">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                     ) : (
                        <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
                     )}
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
                     {user ? (
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button type="button" key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setUserRating(star)} className="focus:outline-none p-1">
                                        <Star className={`h-7 w-7 transition-colors ${star <= (hoverRating || userRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-gray-400'}`} />
                                    </button>
                                ))}
                            </div>
                            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts about the product..." className="w-full p-3 border rounded-md min-h-[120px] bg-background" required />
                            <Button type="submit" disabled={isSubmitting || userRating === 0}>
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </form>
                     ) : (
                        <p className="text-muted-foreground">
                            You must be <Link href="/login" className="underline text-primary">logged in</Link> to post a review.
                        </p>
                     )}
                </div>
            </div>

             {/* Similar Products Section */}
            {similarProducts.length > 0 && (
                 <div className="mt-16">
                     <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                         {similarProducts.map((item) => (
                            <Link href={`/product/${item._id}`} key={item._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
                                <div className="relative aspect-square w-full">
                                    <Image src={item.thumbnail} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="p-3">
                                    <h3 className="text-sm font-medium truncate">{item.title}</h3>
                                    <p className="text-primary font-bold mt-1">₹{(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}</p>
                                </div>
                            </Link>
                         ))}
                     </div>
                 </div>
            )}

        </div>
    );
}
