import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/lib/getTokenData";
import mongoose from "mongoose";

/**
 * @description Creates a new order. Requires authentication.
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export async function POST(request: NextRequest) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Authenticate the user
        const user = await getTokenData(request);
        if (!user || !user.id) {
            return NextResponse.json({ error: "Unauthorized. Please log in to place an order." }, { status: 401 });
        }

        // 2. Parse the request body
        const { items, totalAmount, shippingAddress } = await request.json();

        // Basic validation
        if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
            return NextResponse.json({ error: "Missing required order information." }, { status: 400 });
        }

        // 3. Connect to the database
        await dbConnect();

        // 4. Verify stock and prepare updates within a transaction
        for (const item of items) {
            const product = await Product.findById(item.productId).session(session);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found.`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Not enough stock for ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}.`);
            }
            // Decrement stock
            product.stock -= item.quantity;
            await product.save({ session });
        }

        // 5. Create and save the new order
        const newOrder = new Order({
            user: user.id,
            items,
            totalAmount,
            shippingAddress,
            paymentStatus: 'Completed', // Assuming payment is processed on the client side
            orderStatus: 'Pending',
        });
        const savedOrder = await newOrder.save({ session });

        // 6. If all operations are successful, commit the transaction
        await session.commitTransaction();

        // 7. Return the created order
        return NextResponse.json({
            message: "Order placed successfully!",
            success: true,
            order: savedOrder,
        }, { status: 201 });

    } catch (error: any) {
        // If any error occurs, abort the transaction
        await session.abortTransaction();
        
        console.error("CREATE_ORDER_API_ERROR:", error);
        if (error.message.includes("stock") || error.message.includes("not found")) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "An unexpected error occurred while placing the order." }, { status: 500 });

    } finally {
        // End the session
        session.endSession();
    }
}