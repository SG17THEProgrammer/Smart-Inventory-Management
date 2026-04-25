"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
export default function AddOrder({ productId}: any) {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role;
    const [loading, setLoading] = useState(false);
    const [qty, setQty] = useState("");

    const restock = async () => {
        setLoading(true);

        const res = await fetch("/api/restock", {
            method: "POST",
            body: JSON.stringify({
                productId,
                quantity: qty,
                // type,
                requestedBy: session?.user.id,
                status : "pending"
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

        toast.success("Restock request created successfully");

        // onDone();
    };



    return (
        <div className="space-y-3">
            <input
                type="number"
                name="qty"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="border p-2 w-full"
            />

                <Button
                    onClick={() => restock()}
                    disabled={loading}
                    className=" cursor-pointer hover:bg-gray-600"
                >
                    {loading ? "Processing..." : "Order this product"}
                </Button>

        </div>
    );
}