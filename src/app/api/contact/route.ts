import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/lib/getTokenData";

/**
 * @description Saves a contact form submission to the database. Requires authentication.
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate the user and get their details from the token
        const user = await getTokenData(request);
        if (!user || !user.id) {
            return NextResponse.json({ error: "Unauthorized. Please log in to contact us." }, { status: 401 });
        }

        // 2. Parse the request body
        const { queryType, orderId, message } = await request.json();

        // 3. Validate the input
        if (!queryType || !message) {
            return NextResponse.json({ error: "Query type and message are required." }, { status: 400 });
        }
        if (queryType === 'Order Related' && !orderId) {
            return NextResponse.json({ error: "Order ID is required for order-related queries." }, { status: 400 });
        }

        // 4. Connect to the database
        await dbConnect();

        // 5. Create a new contact query document
        const newContactQuery = new Contact({
            user: user.id,
            email: user.email, // Use the authenticated user's email
            queryType,
            orderId: queryType === 'Order Related' ? orderId : undefined,
            message,
        });

        // 6. Save the document
        await newContactQuery.save();

        // 7. Return a success response
        return NextResponse.json({
            message: "Your message has been received! We will get back to you shortly.",
            success: true,
        }, { status: 201 }); // 201 Created

    } catch (error: any) {
        console.error("CONTACT_FORM_API_ERROR:", error);
        if (error.message.includes("jwt")) {
             return NextResponse.json({ error: "Invalid token. Please log in again." }, { status: 401 });
        }
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}