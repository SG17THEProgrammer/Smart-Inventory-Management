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

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || Number(searchParams.get("total")) ;

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}