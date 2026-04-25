import { connectDB } from "@/lib/db";
import Order from "@/models/Orders";
import RestockRequest from "@/models/RestockRequest";
import { NextResponse } from "next/server";


export async function GET() {
     try {
    await connectDB();

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("productId", "name")
      .populate("userId", "name email")
      .lean();

    const restock = await RestockRequest.find()
      .sort({ createdAt: -1 })
      .populate("productId", "name")
      .populate("requestedBy", "name email")
      .lean();

    return NextResponse.json({ orders, restock });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}