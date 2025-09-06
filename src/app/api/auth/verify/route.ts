import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

/**
 * @description Verifies a user's email using a token.
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export async function POST(request: NextRequest) {
    try {
        // Ensure database is connected
        await dbConnect();

        // 1. Get the token from the request body
        const reqBody = await request.json();
        const { token } = reqBody;

        if (!token) {
            return NextResponse.json({ error: "Verification token is missing" }, { status: 400 });
        }

        // 2. Find the user by the verification token and check if the token is still valid (not expired)
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }, // Check that the token expiry is greater than the current time
        });

        // 3. If no user is found, the token is invalid or has expired
        if (!user) {
            return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
        }

        // 4. Update the user's status to verified
        user.isVerified = true;

        // 5. Clear the verification token and its expiry date so it cannot be used again
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        // 6. Save the updated user document to the database
        await user.save();

        // 7. Return a success response
        return NextResponse.json({
            message: "Email verified successfully! You can now log in.",
            success: true,
        }, { status: 200 });

    } catch (error: any) {
        console.error("VERIFY_EMAIL_API_ERROR:", error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}