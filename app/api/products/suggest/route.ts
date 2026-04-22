import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ProductSuggestion from "@/models/ProductSuggestion";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  const user = session?.user as any;

  if (!session || user?.role !== "supplier") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await req.json();

  const suggestion = await ProductSuggestion.create({
    ...body,
    suggestedBy: user.id,
  });

  return NextResponse.json(suggestion);
}