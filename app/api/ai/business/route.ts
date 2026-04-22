import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Products";
import Order from "@/models/Orders";
import { getBusinessAdvice } from "@/lib/ai/businessAdvisor";
export async function GET() {
  await connectDB();

  const products = await Product.find();
  const orders = await Order.find();

  // 🧠 Build demand map
  const demandMap: Record<string, number> = {};

  orders.forEach((o) => {
    if (o.type === "sale") {
      demandMap[o.productId] =
        (demandMap[o.productId] || 0) + o.quantity;
    }
  });

  // 🧠 Build insights
  const summary = products.map((p) => {
    const demand = demandMap[p._id.toString()] || 0;

    return {
      name: p.name,
      stock: p.stock,
      demand,
      status:
        demand > p.stock
          ? "understocked"
          : demand < p.stock / 2
          ? "overstocked"
          : "balanced",
    };
  });

  // 🌤 Season detection (simple)
  const month = new Date().getMonth();
  let season = "normal";

  if (month >= 3 && month <= 6) season = "summer";
  else if (month >= 10 || month <= 1) season = "winter";

  const advice = await getBusinessAdvice({
  summary,
  season,
});

  return NextResponse.json({
    summary,
    season,
    advice
  });
}