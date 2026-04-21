import Order from "@/models/Orders";

export async function getProductDemand(productId: string) {
  const orders = await Order.find({
    productId,
    type: "sale",
  })
    .sort({ createdAt: -1 })
    .limit(7);

  const total = orders.reduce((sum, o) => sum + o.quantity, 0);
  const avg = orders.length ? total / orders.length : 0;

  return {
    avgDailyDemand: avg,
    totalSales: total,
    dataPoints: orders.length,
  };
}


export function getStockoutDays(stock: number, avgDailyDemand: number) {
  if (avgDailyDemand === 0) return null;

  return stock / avgDailyDemand;
}