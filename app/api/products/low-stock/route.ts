import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Products";

export async function GET() {
  await connectDB();

  const products = await Product.find({
    $expr: { $lt: ["$stock", "$threshold"] },
  });

  return NextResponse.json(products);
}