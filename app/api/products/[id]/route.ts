import { connectDB } from "@/lib/db";
import Product from "@/models/Products";
import { NextResponse } from "next/server";

export async function PUT(req: Request, context: any) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    const updated = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    await connectDB();

    const { id } = await context.params;
    console.log("Deleting product with id:", id);

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}