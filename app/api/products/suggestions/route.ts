import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ProductSuggestion from "@/models/ProductSuggestion";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const suggestions = await ProductSuggestion.find().sort({
    createdAt: -1,
  });

  return NextResponse.json(suggestions);
}