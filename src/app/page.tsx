// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { Sparkles } from 'lucide-react';
// import { Product as ProductType } from '@/types';
// import ProductListingClient from '@/components/product/ProductListingClient';

// // Direct database imports for faster data fetching
// import dbConnect from '@/lib/mongodb';
// import Product from '@/models/Product';

// /**
//  * Server-side function to fetch initial data for the homepage
//  * directly from the database, which is much faster than an API call.
//  */
// async function getHomePageData(): Promise<{ products: ProductType[]; categories: string[] }> {
//     try {
//         await dbConnect(); // Connect to the database

//         // Fetch products and categories concurrently
//         const [products, categories] = await Promise.all([
//             Product.find({}).limit(100).sort({ createdAt: -1 }).lean(),
//             Product.distinct('category')
//         ]);

//         // Convert MongoDB documents to plain objects. This is a crucial step
//         // when passing data from a Server Component to a Client Component.
//         const plainProducts = JSON.parse(JSON.stringify(products));

//         return {
//             products: plainProducts,
//             categories: categories || [],
//         };
//     } catch (error) {
//         console.error("Error fetching homepage data:", error);
//         // Return empty arrays on error to prevent the page from crashing
//         return { products: [], categories: [] };
//     }
// }

// // The main homepage is a Server Component
// export default async function HomePage() {
//     // Fetch data on the server before rendering
//     const { products, categories } = await getHomePageData();

//     return (
//         <>
//             {/* Section 1: Hero */}
//             <section className="relative bg-pink-50 dark:bg-gray-900/50 py-20 md:py-32 text-center">
//                 <div className="container mx-auto px-4 z-10">
//                     <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
//                         Your Style, Your Statement
//                     </h1>
//                     <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
//                         Discover curated apparel or become the designer. Bring your vision to life with our custom print studio.
//                     </p>
//                     <div className="mt-8 flex justify-center gap-4">
//                         <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 text-white">
//                             <Link href="/custom-print">
//                                 <Sparkles className="mr-2 h-5 w-5" />
//                                 Create a Custom Print
//                             </Link>
//                         </Button>
//                         <Button asChild size="lg" variant="outline">
//                             <Link href="#products">Shop The Collection</Link>
//                         </Button>
//                     </div>
//                 </div>
//             </section>

//             {/* Section 2: Product Listing */}
//             <section id="products" className="container mx-auto px-4 py-12">
//                 {/* The ProductListingClient component handles all interactivity */}
//                 <ProductListingClient initialProducts={products} categories={categories} />
//             </section>
//         </>
//     );
// }


import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Product as ProductType } from '@/types';
import ProductListingClient from '@/components/product/ProductListingClient';

// Direct database imports for faster data fetching
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

/**
 * Server-side function to fetch initial data for the homepage
 * directly from the database, which is much faster than an API call.
 */
async function getHomePageData(): Promise<{ products: ProductType[]; categories: string[] }> {
    try {
        await dbConnect(); // Connect to the database

        // Fetch products and categories concurrently
        const [products, categories] = await Promise.all([
            Product.find({}).limit(100).sort({ createdAt: -1 }).lean(),
            Product.distinct('category')
        ]);

        // Convert MongoDB documents to plain objects. This is a crucial step
        // when passing data from a Server Component to a Client Component.
        const plainProducts = JSON.parse(JSON.stringify(products));
        // console.log(plainProducts.length);
        
        return {
            products: plainProducts,
            categories: categories || [],
        };
    } catch (error) {
        console.error("Error fetching homepage data:", error);
        // Return empty arrays on error to prevent the page from crashing
        return { products: [], categories: [] };
    }
}

// The main homepage is a Server Component
export default async function HomePage() {
    // Fetch data on the server before rendering the page
    const { products, categories } = await getHomePageData();

    return (
        <>
            {/* Section 1: Hero */}
            <section className="relative bg-pink-50 dark:bg-gray-900/50 py-20 md:py-32 text-center">
                <div className="container mx-auto px-4 z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                       Soft Cotton, Strong Vibes !
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                        Discover curated apparel or become the designer. Bring your vision to life with our custom print studio.
                    </p>
                    {/* --- FIX: This container now stacks buttons vertically on mobile --- */}
                    <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 text-white w-full sm:w-auto">
                            <Link href="/custom-print">
                                <Sparkles className="mr-2 h-5 w-5" />
                                Create a Custom Print
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                            <Link href="#products">Shop The Collection</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Section 2: Product Listing */}
            <section id="products" className="container mx-auto px-4 py-12">
                {/* The ProductListingClient component handles all interactivity */}
                <ProductListingClient initialProducts={products} categories={categories} />
            </section>
        </>
    );
}
