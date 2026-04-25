"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const handleQuantityChange = (id: string, value: number) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const load = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || data);
    };

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        fetch("/api/ai/user-suggestions")
            .then((res) => res.json())
            .then(setSuggestions);
    }, []);

    const buy = async (productId: string, quantity: number) => {
        const res = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId,
                quantity,
                // type: "sale",
            }),
        });

        if (res.ok) {
            toast.success("Purchase successful!");
            setQuantities((prev) => ({ ...prev, [productId]: 1 }));
            load(); // Refresh products 
        } else {
            const data = await res.json();
            toast.error(`Purchase failed: ${data.error || "Unknown error"}`);
        }

        load();
    };

    return (
        <>
            <Navbar
                pathname="/shop"
                handleLogout={() => { }}
            ></Navbar>
            <div className="p-6 space-y-4">
                <h1 className="text-xl font-bold">🛒 Shop</h1>
                <div className="grid grid-cols-5 gap-4">

                    {products.map((p) => {
                        const qty = quantities[p._id] || 1;

                        return (
                            <div
                                key={p._id}
                                className="border p-4 rounded flex flex-col gap-3"
                            >
                                <div>
                                    <p className="font-medium">{p.name}</p>

                                    <p
                                        className={
                                            p.stock > 0
                                                ? "text-green-600"
                                                : "text-red-500"
                                        }
                                    >
                                        {p.stock > 0
                                            ? `In Stock: ${p.stock}`
                                            : "Out of Stock"}
                                    </p>
                                </div>

                                {p.stock > 0 ? (
                                    <div className="flex items-center gap-2">
                                        {/* Quantity Input */}
                                        <Input
                                            type="number"
                                            min={1}
                                            max={p.stock}
                                            value={qty}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    p._id,
                                                    Math.min(
                                                        p.stock,
                                                        Math.max(1, Number(e.target.value))
                                                    )
                                                )
                                            }
                                            className="w-16"
                                        />

                                        {/* Buy Button */}
                                        <Button
                                            size="sm"
                                            onClick={() => buy(p._id, qty)}
                                            className="text-white cursor-pointer"
                                        >
                                            Buy
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        size="sm"
                                        onClick={async () => {
                                           const res = await fetch("/api/notify", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({ productId: p._id }),
                                            });

                                            if (res.ok) {
                                                toast.success("You will be notified when the product is back in stock.");
                                            } else {
                                                const data = await res.json();
                                                toast.error(`Failed to register notification: ${data.error || "Unknown error"}`);
                                            }
                                        }}
                                        className="bg-amber-500 text-white rounded hover:bg-amber-400 cursor-pointer"
                                    >
                                        Notify Me
                                    </Button>
                                )}
                            </div>
                        );
                    })}

                </div>
                <div className="bg-yellow-50 p-4 rounded">
                    <h2 className="font-semibold mb-2">
                        ⭐ Recommended for you
                    </h2>

                    {suggestions.length > 0  ? suggestions.map((s, i) => (
                        <p key={i} className="text-sm">
                            {s.name} — {s.reason}
                        </p>
                    )) : (
                        <p className="text-sm text-muted-foreground">
                            No recommendations available.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}