import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({ isCustomizable: true });
        return NextResponse.json({ products });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch customizable products" }, { status: 500 });
    }
}