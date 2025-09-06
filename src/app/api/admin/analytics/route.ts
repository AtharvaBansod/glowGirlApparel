import { getTokenData } from "@/lib/getTokenData";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET(request: NextRequest) {
    try {
        const userPayload = getTokenData(request);
        if (!userPayload.isAdmin) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }
        await dbConnect();

        const [userCount, productCount, orderData, recentOrders] = await Promise.all([
            User.countDocuments({ isAdmin: false }),
            Product.countDocuments(),
            Order.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, orderCount: { $sum: 1 } } }
            ]),
            Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'name email')
        ]);
        
        const analytics = {
            userCount,
            productCount,
            totalRevenue: orderData[0]?.totalRevenue || 0,
            orderCount: orderData[0]?.orderCount || 0,
            recentOrders
        };

        return NextResponse.json(analytics);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}