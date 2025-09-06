import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @description Handles user login.
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export async function POST(request: NextRequest) {
    try {
        // Ensure database is connected
        await dbConnect();

        // 1. Parse request body for email and password
        const reqBody = await request.json();
        const { email, password } = reqBody;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // 2. Check if user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
        }

        // 3. Check if the user's email is verified
        if (!user.isVerified) {
            return NextResponse.json({ error: "Please verify your email before logging in." }, { status: 403 });
        }

        // 4. Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
        }

        // 5. Create JWT payload
        const tokenPayload = {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        };

        // 6. Sign the JWT with a secret key and set an expiration
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
            expiresIn: "1d", // Token expires in 1 day
        });

        // 7. Create a successful response and set the token in an HTTP-only cookie
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        response.cookies.set("token", token, {
            httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day in seconds
        });

        return response;

    } catch (error: any) {
        console.error("LOGIN_API_ERROR:", error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}