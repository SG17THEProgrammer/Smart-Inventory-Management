import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RestockRequest from "@/models/RestockRequest";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { productId, quantity } = await req.json();

  const request = await RestockRequest.create({
    productId,
    quantity,
    requestedBy: session.user.id,
  });

  return NextResponse.json(request);
}