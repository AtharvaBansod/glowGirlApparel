import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/lib/getTokenData";

/**
 * @description Fetches all orders for the currently authenticated user.
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export async function GET(request: NextRequest) {
    try {
        // 1. Get the user's ID from their authentication token
        const user = await getTokenData(request);
        if (!user || !user.id) {
            return NextResponse.json({ error: "Unauthorized. Please log in to view your orders." }, { status: 401 });
        }

        // 2. Connect to the database
        await dbConnect();

        // 3. Find all orders that belong to the user, sorted by most recent first
        const orders = await Order.find({ user: user.id }).sort({ createdAt: -1 });

        // 4. Return the list of orders
        // Note: If the user has no orders, this will correctly return an empty array.
        return NextResponse.json({
            message: "User orders fetched successfully.",
            success: true,
            orders,
        }, { status: 200 });

    } catch (error: any) {
        console.error("GET_USER_ORDERS_API_ERROR:", error);
        if (error.message.includes("jwt")) {
             return NextResponse.json({ error: "Invalid token. Please log in again." }, { status: 401 });
        }
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}