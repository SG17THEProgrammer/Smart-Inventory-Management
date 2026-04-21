"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";
export default function ProductList({
    products,
    selected,
    onSelect,
    refresh,
}: any) {

    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="">Products</h2>
                <Button onClick={() => setOpen(!open)} variant="outline" size="sm" className="cursor-pointer">
                    +
                </Button>
            </div>
            {open && (
                <div className="top-16 left-4 right-4 bg-white p-4 shadow">
                    <AddProduct refresh={refresh} setOpen={setOpen} />
                </div>
            )}
            {products.map((p: any) => (
                <Card
                    key={p._id}
                    onClick={() => onSelect(p)}
                    className={`p-3 cursor-pointer ${selected?._id === p._id ? "border-black" : ""
                        }`}
                >
                    <div className="flex justify-between items-center">
                        <div onClick={() => onSelect(p)} className="cursor-pointer flex-1">
                            <p className="font-medium">{p.name}</p>
 <p
                        className={`text-sm ${p.stock === 0
                                ? "text-red-500"
                                : p.stock < 10
                                    ? "text-yellow-500"
                                    : "text-green-600"
                            }`}
                    >
                        Stock: {p.stock}
                    </p>                         </div>

                        <div className="flex gap-2">
                            <EditProduct product={p} onDone={refresh} />
                            <DeleteProduct productId={p._id} onDone={refresh} />
                        </div>
                    </div>

                </Card>
            ))}

            <Button onClick={refresh} variant="outline" className="cursor-pointer">
                Refresh
            </Button>
        </div>
    );
}