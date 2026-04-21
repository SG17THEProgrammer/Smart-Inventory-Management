"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AddOrder({ productId, onDone }: any) {
    const [loading, setLoading] = useState(false);
    const [qty, setQty] = useState(1);

    const createOrder = async (type: string) => {
        setLoading(true);

        const res = await fetch("/api/orders", {
            method: "POST",
            body: JSON.stringify({
                productId,
                quantity: qty,
                type,
            }),
        });

        const data = await res.json();

        setLoading(false);

        if (!res.ok) {
            // toast({
            //     title: "Error",
            //     description: data.error || "Something went wrong",
            //     variant: "destructive",
            // });
            toast.error(data.error || "Something went wrong");
            return;
        }

        // toast({
        //     title: "Success",
        //     description:
        //         type === "sale"
        //             ? "Product sold successfully"
        //             : "Stock updated",
        // });

        toast.success(type === "sale"
            ? "Product sold successfully"
            : "Stock updated");

        onDone();
    };

    return (
        <div className="space-y-3">
            <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border p-2 w-full"
            />

            <div className="flex gap-2">
                <Button
                    onClick={() => createOrder("sale")}
                    disabled={loading}
                    className="bg-red-500 cursor-pointer"
                >
                    {loading ? "Processing..." : "Order this product"}
                </Button>

                <Button
                    onClick={() => createOrder("purchase")}
                    disabled={loading}
                    className="bg-green-500 cursor-pointer"
                >
                    {loading ? "Processing..." : "Add items in the stock"}
                </Button>
            </div>
        </div>
    );
}