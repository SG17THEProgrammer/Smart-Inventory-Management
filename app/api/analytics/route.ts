import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Products";
import Order from "@/models/Orders";

export async function GET() {
  await connectDB();

  const products = await Product.find();
  const orders = await Order.find().populate("productId");

  // 🔴 LOW STOCK
  const lowStock = products.filter(
    (p) => p.stock <= p.threshold
  );

  // 📊 DEMAND
  const demandMap: Record<string, number> = {};

  orders.forEach((o: any) => {
    const name = o.productId?.name;
    if (!name) return;

    demandMap[name] =
      (demandMap[name] || 0) + o.quantity;
  });

  // 🟢 HIGH DEMAND
  const highDemand = Object.entries(demandMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 🔴 DEAD STOCK
  const deadStock = products.filter(
    (p) => !(p.name in demandMap)
  );

  // 🟡 SLOW STOCK
  const slowStock = products.filter((p) => {
    const d = demandMap[p.name] || 0;
    return d > 0 && d < 5;
  });

  // 💰 METRICS
  let totalOrders = orders.length;
  let totalRevenue = 0;
  let stockouts = 0;

  orders.forEach((o: any) => {
    if (o.stockout) stockouts++;

    if (o.productId?.price) {
      totalRevenue += o.quantity * o.productId.price;
    }
  });

  // 📈 TREND
  const trendMap: Record<string, number> = {};

  orders.forEach((o: any) => {
    const date = new Date(o.createdAt)
      .toISOString()
      .slice(0, 10);

    trendMap[date] =
      (trendMap[date] || 0) + o.quantity;
  });

  const trend = Object.entries(trendMap)
    .map(([date, value]) => ({ date, value }))
    .slice(-7);

  return NextResponse.json({
    lowStock,
    highDemand,
    deadStock,
    slowStock,
    metrics: {
      totalOrders,
      totalRevenue,
      stockouts,
    },
    trend,
  });
}