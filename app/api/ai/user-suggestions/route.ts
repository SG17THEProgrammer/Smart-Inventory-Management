import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Products";
import Order from "@/models/Orders";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" });
  }

  const userId = session.user.id;

  // 🧾 User purchase history
  const orders = await Order.find({
    userId,
    type: "sale",
  }).populate("productId");

  // 📦 All products
  const products = await Product.find();

  // 📊 trending (most ordered)
  const trending = await Order.aggregate([
    { $match: { type: "sale" } },
    { $group: { _id: "$productId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  const prompt = `
You are an AI shopping assistant.

User purchase history:
${orders.map(o => o.productId?.name).join(", ")}

Available products:
${products.map(p => p.name).join(", ")}

Trending products:
${JSON.stringify(trending)}

Suggest 3 products the user should try next.
Explain WHY in one line each.
Return JSON:
[
  { "name": "", "reason": "" }
]
`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();

  let suggestions = [];

  try {
    suggestions = JSON.parse(
      data.choices[0].message.content
    );
  } catch {
    suggestions = [];
  }

  return NextResponse.json(suggestions);
}