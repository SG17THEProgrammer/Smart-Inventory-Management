import { connectDB } from "@/lib/db";
import Order from "@/models/Orders";
import Product from "@/models/Products";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";
import Insight from "@/models/Insight";
import { orderSchema } from "@/validators/order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const body = await req.json();

        const { productId, quantity, type } = body;

        const parsed = orderSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Update stock
        if (type === "sale") {
            if (product.stock < quantity) {
                // 💸 record stockout loss
                await Order.create({
                    productId,
                    quantity: quantity - product.stock,
                    type: "sale",
                    stockout: true,
                });
                return NextResponse.json(
                    {
                        error: "Insufficient stock",
                        message: `Only ${product.stock} items available`,
                    },
                    { status: 400 }
                );
            }

            product.stock -= quantity;
        } else if (type === "purchase") {
            product.stock += quantity;

            // 🔔 notify users
            const notifications = await Notification.find({ productId });

            for (const n of notifications) {
                //send email logic here (omitted for brevity)
                console.log(`Notify ${n.email}: Product back in stock`);
            }

            // optional: clear notifications
            await Notification.deleteMany({ productId });
        }

        await product.save();

        const order = await Order.create({
            productId,
            quantity,
            type,
            userId,
        });

        await Insight.deleteOne({ productId });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("POST /orders error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}

export async function GET() {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
}