import { connectDB } from "@/lib/db";
import Product from "@/models/Products";
import { productSchema } from "@/validators/product";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const product = await Product.create(parsed.data);
  return NextResponse.json(product);
}

export async function GET() {
  await connectDB();
  const products = await Product.find();
  return NextResponse.json(products);
}