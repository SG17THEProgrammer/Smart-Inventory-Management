import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RestockRequest from "@/models/RestockRequest";
import Product from "@/models/Products";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "supplier") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const { action } = await req.json();

  if (action === "reject") {
    await RestockRequest.findByIdAndUpdate(id, { status: "rejected" });
    return NextResponse.json({ success: true });
  }

  const request = await RestockRequest.findById(id);

  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ✅ Increase stock
  await Product.findByIdAndUpdate(request.productId, {
    $inc: { stock: request.quantity },
  });

  request.status = "approved";
  await request.save();

  return NextResponse.json({ success: true });
}