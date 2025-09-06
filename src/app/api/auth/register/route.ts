import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/lib/mailer";

/**
 * @description Handles new user registration.
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export async function POST(request: NextRequest) {
    try {
        // Ensure database is connected
        await dbConnect();

        // 1. Parse request body for user details
        const reqBody = await request.json();
        const { name, email, mobile, password } = reqBody;

        // Basic validation
        if (!name || !email || !mobile || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // 2. Check if a user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 409 }); // 409 Conflict
        }

        // 3. Hash the password before storing it
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // 4. Create a new user instance
        const newUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
        });

        // 5. Save the new user to the database
        const savedUser = await newUser.save();

        // 6. Send a verification email to the user
        await sendEmail({
            email: savedUser.email,
            emailType: "VERIFY",
            userId: savedUser._id
        });

        // 7. Return a success response
        return NextResponse.json({
            message: "Registration successful! A verification link has been sent to your email.",
            success: true,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
            }
        }, { status: 201 }); // 201 Created

    } catch (error: any) {
        console.error("REGISTER_API_ERROR:", error);
        // Handle potential Mongoose validation errors
        if (error.name === 'ValidationError') {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}