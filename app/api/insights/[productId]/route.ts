import { connectDB } from "@/lib/db";
import Product from "@/models/Products";
import Insight from "@/models/Insight";
import { getProductDemand } from "@/services/analytics";
import { getAIInsight } from "@/services/ai";
import { NextResponse } from "next/server";
import { getStockoutDays } from "@/services/analytics";
import { generateAlerts } from "@/services/alerts";


const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

export async function GET(req: Request, context: any) {
  try {
    await connectDB();

    const { productId } = await context.params;

    if (!productId) {
      return NextResponse.json(
        { error: "Missing productId" },
        { status: 400 }
      );
    }

    // 🔍 1. Check product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // 🔍 2. cached insight
    const cached = await Insight.findOne({ productId });

    if (cached) {
      const isStale =
        Date.now() - new Date(cached.lastUpdatedAt).getTime() >
        CACHE_DURATION;

      if (!isStale) {
        return NextResponse.json({
          source: "cache",
          product,
          demand: cached.demand,
          insight: cached.insight,
        });
      }
    }

    // 📊 3. fresh demand
    const demand = await getProductDemand(productId);

    const stockoutDays = getStockoutDays(
      product.stock,
      demand.avgDailyDemand
    );


    const alerts = generateAlerts({
      stock: product.stock,
      threshold: product.threshold,
      stockoutDays,
    });

    // 🤖 4. AI insight
    const insightText = await getAIInsight({
      product: {
        name: product.name,
        stock: product.stock,
      },
      demand,
      stockoutDays
    });

    // 💾 5. Save / Update cache
    await Insight.findOneAndUpdate(
      { productId },
      {
        productId,
        insight: insightText,
        demand,
        lastUpdatedAt: new Date(),
      },
      { upsert: true, new: true }
    );




    return NextResponse.json({
      source: "fresh",
      product,
      demand,
      insight: insightText,
      stockoutDays,
      alerts
    });
  } catch (error) {
    console.error("INSIGHTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 }
    );
  }
}