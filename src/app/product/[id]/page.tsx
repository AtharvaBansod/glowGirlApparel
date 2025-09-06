

import { notFound } from 'next/navigation';
import { Product as ProductType } from '@/types';
import ProductDetailsClient from './ProductDetailsClient';

// Direct database imports for fast, server-side data fetching
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

/**
 * Server-side function to fetch a single product's data and its similar products
 * directly from the database.
 * @param id The MongoDB ObjectId of the product.
 */
async function getProductData(id: string): Promise<{ product: ProductType | null; similarProducts: ProductType[] }> {
    try {
        await dbConnect(); // Ensure we have a database connection

        // Fetch the main product. .lean() returns a plain JS object for performance.
        const productFromDb = await Product.findById(id).lean();

        // If no product is found, we can stop here.
        if (!productFromDb) {
            return { product: null, similarProducts: [] };
        }

        // --- FIX IS HERE ---
        // We first cast to 'unknown' then to our specific type to satisfy TypeScript's strictness.
        const product = productFromDb as unknown as ProductType;

        // Fetch similar products ONLY after confirming the main product exists.
        const similarProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id } // $ne means "not equal"
        }).limit(5).lean();

        // Serialize the data: This is a robust way to convert MongoDB documents (BSON)
        // into plain JSON, which is safe to pass from Server to Client Components.
        const serializedProduct = JSON.parse(JSON.stringify(product));
        const serializedSimilar = JSON.parse(JSON.stringify(similarProducts));

        return { product: serializedProduct, similarProducts: serializedSimilar };

    } catch (error) {
        // Handle potential errors, like an invalid ID format
        console.error("Failed to fetch product data:", error);
        return { product: null, similarProducts: [] };
    }
}

/**
 * This is the main Server Component for the product details page.
 * It fetches data on the server and then passes it to a Client Component for interaction.
 */
export default async function ProductPage({ params }: { params: { id: string } }) {
    // Fetch the data on the server before rendering the page
    const { product, similarProducts } = await getProductData(params.id);

    // If the product is not found in the database, render the 404 page
    if (!product) {
        notFound();
    }

    // Pass the server-fetched data as props to the interactive client component
    return <ProductDetailsClient initialProduct={product} similarProducts={similarProducts} />;
}

