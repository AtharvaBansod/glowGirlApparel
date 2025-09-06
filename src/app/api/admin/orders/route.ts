import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/lib/getTokenData";
import mongoose from "mongoose";

/**
 * @description [ADMIN] Fetches all orders with pagination and filtering.
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

        // 2. Get pagination and filter parameters from the URL query
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const skip = (page - 1) * limit;

        // 3. Build the filter condition
        const filterCondition: { orderStatus?: string } = {};
        if (status && ['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
            filterCondition.orderStatus = status;
        }

        // 4. Connect to the database
        await dbConnect();

        // 5. Fetch orders and total count
        const [orders, total] = await Promise.all([
            Order.find(filterCondition)
                .populate('user', 'name email') // Populate user's name and email
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Order.countDocuments(filterCondition)
        ]);
        
        return NextResponse.json({
            message: "Orders fetched successfully.",
            success: true,
            orders,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });

    } catch (error: any) {
        console.error("ADMIN_GET_ORDERS_API_ERROR:", error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}

/**
 * @description [ADMIN] Updates the status of an order.
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export async function PATCH(request: NextRequest) {
    try {
        // 1. Authenticate and authorize the user as an admin
        const user = await getTokenData(request);
        if (!user || !user.isAdmin) {
            return NextResponse.json({ error: "Access denied. Admin privileges required." }, { status: 403 });
        }
        
        // 2. Parse the request body
        const { orderId, status } = await request.json();

        // 3. Validate input
        if (!orderId || !status) {
            return NextResponse.json({ error: "Order ID and new status are required." }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return NextResponse.json({ error: "Invalid Order ID format." }, { status: 400 });
        }
        if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
            return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
        }

        // 4. Connect to the database and update the order
        await dbConnect();
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: status },
            { new: true } // Return the updated document
        ).populate('user', 'name email');

        if (!updatedOrder) {
            return NextResponse.json({ error: "Order not found." }, { status: 404 });
        }

        return NextResponse.json({
            message: `Order status updated to '${status}'.`,
            success: true,
            order: updatedOrder,
        });

    } catch (error: any) {
        console.error("ADMIN_UPDATE_ORDER_API_ERROR:", error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}