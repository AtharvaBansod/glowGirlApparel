import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { getTokenData } from "@/lib/getTokenData";
import { NextRequest, NextResponse } from "next/server";

/**
 * @description [ADMIN] Fetches all contact form submissions with pagination.
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export async function GET(request: NextRequest) {
    try {
        // 1. Authenticate and authorize the user as an admin
        const user = await getTokenData(request);
        if (!user || !user.isAdmin) {
            return NextResponse.json({ error: "Access denied. Admin privileges required." }, { status: 403 });
        }

        // 2. Get pagination parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        await dbConnect();

        // 3. Fetch queries and total count concurrently
        const [queries, total] = await Promise.all([
            Contact.find({})
                .populate('user', 'name email') // Populate user details
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Contact.countDocuments({})
        ]);
        
        return NextResponse.json({
            message: "Contact queries fetched successfully.",
            success: true,
            queries,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });

    } catch (error: any) {
        console.error("ADMIN_GET_CONTACTS_API_ERROR:", error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}
