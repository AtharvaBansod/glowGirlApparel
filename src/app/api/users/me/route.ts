import { getTokenData } from "@/lib/getTokenData";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function GET(request:NextRequest){
    try {
        await dbConnect();
        const userPayload = getTokenData(request);
        const user = await User.findOne({_id: userPayload.id}).select("-password");
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }
        return NextResponse.json({
            message: "User found",
            user
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 401});
    }
}