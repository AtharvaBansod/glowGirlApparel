import { ProductGrid } from '@/components/product/ProductGrid';
import { Product as ProductType } from '@/types';

// Direct database imports for fast, server-side data fetching
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

/**
 * Server-side function to fetch search results directly from the database.
 * @param query The user's search term.
 */
async function fetchSearchResults(query: string): Promise<{ products: ProductType[], total: number }> {
    try {
        await dbConnect(); // Connect to the database

        // Create a case-insensitive search condition (regex) for the product title
        const searchCondition = query
            ? { title: { $regex: query, $options: 'i' } }
            : {};

        // Find all products that match the search condition
        const products = await Product.find(searchCondition).lean();
        
        // Serialize the MongoDB documents to plain JSON to safely pass them to the component
        const plainProducts = JSON.parse(JSON.stringify(products));

        return { products: plainProducts, total: products.length };
    } catch (error) {
        console.error("Error in fetchSearchResults:", error);
        return { products: [], total: 0 };
    }
}

/**
 * This is the main Server Component for the search results page.
 * It reads the query from the URL, fetches data on the server, and renders the results.
 */
export default async function SearchPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
    // Safely get the search query 'q' from the URL
    const query = typeof searchParams?.q === 'string' ? searchParams.q : '';
    let searchResults: ProductType[] = [];
    let totalResults = 0;

    // Only perform a search if a query exists
    if (query) {
        const { products, total } = await fetchSearchResults(query);
        searchResults = products;
        totalResults = total;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">
                    {query ? `Search Results` : 'Search for Products'}
                </h1>
                {query && (
                    <p className="text-muted-foreground">
                        {totalResults > 0 ? `${totalResults} results found for ` : 'No results found for '}
                        <span className="font-semibold text-foreground">"{query}"</span>
                    </p>
                )}
            </div>

            {query ? (
                // If there was a search, display the grid (which will show a "not found" message if empty)
                <ProductGrid products={searchResults} />
            ) : (
                // If there was no search, show a prompt to the user
                <div className="flex justify-center items-center min-h-[400px]">
                    <p className="text-muted-foreground">
                        Use the search bar in the navigation to find products.
                    </p>
                </div>
            )}
        </div>
    );
}