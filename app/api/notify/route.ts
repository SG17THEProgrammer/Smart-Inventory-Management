import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

   const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" });
  }


  const { productId } = await req.json();

  if (!productId ) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  await Notification.create({ productId, email : session.user.email, userId: session.user.id, });

  return NextResponse.json({ message: "Notification registered" }  , { status: 201 });
}