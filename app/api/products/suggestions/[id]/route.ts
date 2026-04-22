import { connectDB } from "@/lib/db";
import ProductSuggestion from "@/models/ProductSuggestion";
import Product from "@/models/Products";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: Request,
   context: { params: Promise<{ id: string }> }
) {
  await connectDB();

const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

   const { id } = await context.params;

  const suggestion = await ProductSuggestion.findById(id);

  console.log(suggestion);

  if (!suggestion) {
    return NextResponse.json({ error: "Not found" }, {status: 404 });
  }

  // ✅ Approve → create real product
  const res = await Product.create({
    name: suggestion.name,
    sku: suggestion.sku,
    price: suggestion.price,
    stock: 0,
    threshold: 10,
  });

  if (!res) {
    return NextResponse.json({ error: "Failed to create product" }, {status: 500 });
  }

  suggestion.status = "approved";
  await suggestion.save();

  return NextResponse.json({ success: true });
}

// ❌ Reject
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { id } = await context.params;

   const res = await ProductSuggestion.findByIdAndUpdate(id, {
    status: "rejected",
  });

  if (!res) {
    return NextResponse.json({ error: "Not found" }, {status: 404 });
  }

  return NextResponse.json({ success: true } , {status: 200});
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  const res = await ProductSuggestion.findByIdAndDelete(id);

  if (!res) {
    return NextResponse.json({ error: "Not found" }, {status: 404 });
  }

  return NextResponse.json({ success: true } , {status: 200});
}