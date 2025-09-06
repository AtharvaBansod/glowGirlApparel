// import dbConnect from "@/lib/mongodb";
// import Product from "@/models/Product";
// import mongoose from "mongoose";
// import { NextRequest, NextResponse } from "next/server";

// /**
//  * @description Fetches a single product by its ID.
//  * @param {NextRequest} request
//  * @param {{ params: { id: string } }} { params }
//  * @returns {NextResponse}
//  */
// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         const productId = params.id;

//         // 1. Validate the product ID format
//         if (!mongoose.Types.ObjectId.isValid(productId)) {
//             return NextResponse.json({ error: "Invalid product ID format." }, { status: 400 });
//         }
        
//         // 2. Connect to the database
//         await dbConnect();

//         // 3. Find the product by its ID
//         const product = await Product.findById(productId);

//         // 4. If product is not found, return a 404 error
//         if (!product) {
//             return NextResponse.json({ error: "Product not found." }, { status: 404 });
//         }

//         // 5. Return the product data
//         return NextResponse.json(product, { status: 200 });

//     } catch (error: any) {
//         console.error("GET_PRODUCT_BY_ID_API_ERROR:", error);
//         return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
//     }
// }