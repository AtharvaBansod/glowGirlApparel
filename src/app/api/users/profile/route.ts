import { getTokenData } from "@/lib/getTokenData";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

// Get user profile
export async function GET(request:NextRequest) {
    try {
        await dbConnect();
        const userPayload = getTokenData(request);
        const user = await User.findById(userPayload.id).select("-password");
        return NextResponse.json({ user });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}

// Update user profile (name, mobile, or add address)
export async function PATCH(request: NextRequest) {
    try {
        await dbConnect();
        const userPayload = getTokenData(request);
        const reqBody = await request.json();
        const { name, mobile, newAddress } = reqBody;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (mobile) updateData.mobile = mobile;
        if (newAddress) updateData.$push = { addresses: newAddress };

        const updatedUser = await User.findByIdAndUpdate(userPayload.id, updateData, { new: true }).select("-password");
        return NextResponse.json({ message: "Profile updated", user: updatedUser });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}