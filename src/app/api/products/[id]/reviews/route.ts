import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/lib/getTokenData";

/**
 * @description Adds a new review to a product. Requires authentication.
 * @param {NextRequest} request
 * @param {{ params: { id: string } }} { params }
 * @returns {NextResponse}
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // 1. Verify user is authenticated and get user data from token
        const user = await getTokenData(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized. Please log in to post a review." }, { status: 401 });
        }

        // 2. Get the product ID from the URL parameters
        const productId = params.id;
        if (!productId) {
            return NextResponse.json({ error: "Product ID is missing." }, { status: 400 });
        }

        // 3. Parse the review data from the request body
        const { rating, comment } = await request.json();
        
        // Basic validation
        if (!rating || !comment) {
            return NextResponse.json({ error: "Rating and comment are required." }, { status: 400 });
        }
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be a number between 1 and 5." }, { status: 400 });
        }

        // 4. Connect to the database and find the product
        await dbConnect();
        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }

        // 5. Create the new review object
        const newReview = {
            rating,
            comment,
            reviewerName: user.name, // Use the name from the authenticated user's token
            date: new Date(),
        };

        // 6. Add the new review to the product's reviews array
        product.reviews.push(newReview);

        // 7. Save the product. The `pre('save')` hook in the Product model
        // will automatically recalculate the average rating.
        const updatedProduct = await product.save();

        // 8. Return the updated product data with the new review
        return NextResponse.json({
            message: "Review added successfully!",
            success: true,
            product: updatedProduct,
        }, { status: 201 }); // 201 Created

    } catch (error: any) {
        console.error("ADD_REVIEW_API_ERROR:", error);
        // Handle specific errors like invalid token
        if (error.message.includes("jwt")) {
             return NextResponse.json({ error: "Invalid token. Please log in again." }, { status: 401 });
        }
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}