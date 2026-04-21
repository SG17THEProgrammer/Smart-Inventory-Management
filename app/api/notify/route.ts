import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { productId, email } = await req.json();

  if (!productId || !email) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  await Notification.create({ productId, email });

  return NextResponse.json({ message: "Notification registered" });
}