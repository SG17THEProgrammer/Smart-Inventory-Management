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

        const { productId, quantity } = body;

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

        // 🚨 STOCK CHECK
        if (product.stock < quantity) {
            return NextResponse.json({
                error: "Out of stock",
                status : 400
            });
        }
        else{
            const order =  await Order.create({
                productId,
                quantity,
                userId,
                // stockout: true,
            });
            
            // ✅ NORMAL SALE
            product.stock -= quantity;
            await product.save();
            
            return NextResponse.json(order, { status: 201 });
        }


        // await Order.create({
        //     productId,
        //     quantity,
        //     userId,
        // });

        // 🔔 notify users
        // const notifications = await Notification.find({ productId });

        // for (const n of notifications) {
        //     //send email  
        //     console.log(`Notify ${n.email}: Product back in stock`);
        // }

        // clear notifications
        // await Notification.deleteMany({ productId });
    

    // const order = await Order.create({
    //     productId,
    //     quantity,
    //     userId,
    // });

    // await Insight.deleteOne({ productId });

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
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5).populate("productId" , "name").populate("userId", "name email");
    return NextResponse.json(orders);
}