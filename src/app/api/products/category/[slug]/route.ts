// import dbConnect from "@/lib/mongodb";
// import Product from "@/models/Product";
// import { NextRequest, NextResponse } from "next/server";

// /**
//  * @description Fetches products by category slug with pagination.
//  * @param {NextRequest} request
//  * @param {{ params: { slug: string } }} { params }
//  * @returns {NextResponse}
//  */
// export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
//     try {
//         const categorySlug = params.slug;
        
//         // 1. Get pagination parameters from the URL query
//         const { searchParams } = new URL(request.url);
//         const page = parseInt(searchParams.get('page') || '1');
//         const limit = parseInt(searchParams.get('limit') || '8');
//         const skip = (page - 1) * limit;

//         if (!categorySlug) {
//              return NextResponse.json({ error: "Category slug is required." }, { status: 400 });
//         }

//         // 2. Connect to the database
//         await dbConnect();

//         // 3. Define the query condition
//         const queryCondition = { category: categorySlug };

//         // 4. Fetch the paginated products and the total count concurrently
//         const [products, total] = await Promise.all([
//             Product.find(queryCondition).skip(skip).limit(limit).sort({ createdAt: -1 }),
//             Product.countDocuments(queryCondition)
//         ]);

//         // 5. Return the structured response
//         return NextResponse.json({
//             message: `Products for category '${categorySlug}' fetched successfully.`,
//             success: true,
//             products,
//             total,
//             page,
//             totalPages: Math.ceil(total / limit),
//         }, { status: 200 });

//     } catch (error: any) {
//         console.error("GET_PRODUCTS_BY_CATEGORY_API_ERROR:", error);
//         return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
//     }
// }