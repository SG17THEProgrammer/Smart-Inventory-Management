import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Orders";
import Products from "@/models/Products";

export async function GET() {
  await connectDB();

  const orders = await Order.find();
  const products = await Products.find();


  let sales = 0;
  let purchases = 0;

  const daily: Record<string, number> = {};
  const demandMap: Record<string, number> = {};
  let stockoutLoss = 0;

  orders.forEach((o) => {
    const date = new Date(o.createdAt).toISOString().split("T")[0];

    if (!daily[date]) daily[date] = 0;

    if (o.type === "sale") {
      sales += o.quantity;
      daily[date] += o.quantity;

       demandMap[o.productId] =
        (demandMap[o.productId] || 0) + o.quantity;

      // 💸 Stockout loss (if flagged earlier)
      if (o.stockout) {
        stockoutLoss += o.quantity;
      }

    } else {
      purchases += o.quantity;
    }
  });

  const trend = Object.entries(daily).map(([date, value]) => ({
    date,
    demand: value,
  }));

   // 💰 Cash Flow
  const cashFlow = sales - purchases;

  // 📦 Product classification
  const classification = products.map((p) => {
    const demand = demandMap[p._id.toString()] || 0;

    let status = "balanced";

    if (demand > p.stock) status = "fast-moving";
    else if (demand < p.stock / 2 && p.stock > 20)
      status = "dead-stock";
    else if (demand < p.stock) status = "slow-moving";

    return {
      name: p.name,
      stock: p.stock,
      demand,
      status,
    };
  });


  return NextResponse.json({
    sales,
    purchases,
    trend,
    profitEstimate: sales * 10, // simple demo logic
    stockoutLoss,
    classification,
    cashFlow
  });
}