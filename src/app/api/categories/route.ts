// import dbConnect from "@/lib/mongodb";
// import Product from "@/models/Product";
// import { NextRequest, NextResponse } from "next/server";

// /**
//  * @description Fetches a list of all unique product categories.
//  * @param {NextRequest} request
//  * @returns {NextResponse}
//  */
// export async function GET(request: NextRequest) {
//     try {
//         // 1. Connect to the database
//         await dbConnect();

//         // 2. Use the `distinct` method to get an array of all unique values for the 'category' field
//         const categories = await Product.distinct('category');
        
//         // 3. Return the array of categories
//         return NextResponse.json(categories, { status: 200 });

//     } catch (error: any) {
//         console.error("GET_CATEGORIES_API_ERROR:", error);
//         return NextResponse.json({ error: "An unexpected error occurred while fetching categories." }, { status: 500 });
//     }
// }