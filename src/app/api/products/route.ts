// import dbConnect from "@/lib/mongodb";
// import Product from "@/models/Product";
// import { NextRequest, NextResponse } from "next/server";

// /**
//  * @description Fetches all products with pagination and search functionality.
//  * @param {NextRequest} request
//  * @returns {NextResponse}
//  */
// export async function GET(request: NextRequest) {
//     try {
//         // 1. Get pagination and search parameters from the URL query
//         const { searchParams } = new URL(request.url);
//         const page = parseInt(searchParams.get('page') || '1');
//         const limit = parseInt(searchParams.get('limit') || '8');
//         const searchQuery = searchParams.get('query') || '';
//         const skip = (page - 1) * limit;

//         // 2. Connect to the database
//         await dbConnect();

//         // 3. Build the query condition for searching
//         // Searches for the query string in title, description, or category fields case-insensitively
//         const queryCondition = searchQuery
//             ? {
//                   $or: [
//                       { title: { $regex: searchQuery, $options: 'i' } },
//                       { description: { $regex: searchQuery, $options: 'i' } },
//                       { category: { $regex: searchQuery, $options: 'i' } },
//                       { brand: { $regex: searchQuery, $options: 'i' } },
//                   ],
//               }
//             : {};

//         // 4. Fetch the paginated products and the total count concurrently for efficiency
//         const [products, total] = await Promise.all([
//             Product.find(queryCondition)
//                 .sort({ createdAt: -1 }) // Sort by newest first
//                 .skip(skip)
//                 .limit(limit),
//             Product.countDocuments(queryCondition)
//         ]);
        
//         // 5. Return the structured response
//         return NextResponse.json({
//             message: "Products fetched successfully.",
//             success: true,
//             products,
//             total,
//             page,
//             totalPages: Math.ceil(total / limit),
//         }, { status: 200 });

//     } catch (error: any) {
//         console.error("GET_ALL_PRODUCTS_API_ERROR:", error);
//         return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
//     }
// }