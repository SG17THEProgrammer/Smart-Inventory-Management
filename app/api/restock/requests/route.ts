import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RestockRequest from "@/models/RestockRequest";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "supplier") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const requests = await RestockRequest.find({
    status: "pending",
  }).populate("productId");

  return NextResponse.json(requests);
}