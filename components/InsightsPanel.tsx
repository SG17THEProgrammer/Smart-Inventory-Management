"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddOrder from "./AddOrder";
import { toast } from "sonner";
import AIParser from "./AIParser";
import OrderList from "./OrderList";

export default function InsightsPanel({ product, refreshProducts }: any) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);


    const loadInsights = async () => {
        setLoading(true);
        //   if(product?.length>0) {
        const res = await fetch(`/api/insights/${product._id}`);
        const d = await res.json();
        setData(d);
        setLoading(false);
        // }
        // else{
        //     setData(null);
        //     setLoading(false);
        // }
    };

    useEffect(() => {
        loadInsights();
    }, [product]);

    const isOutOfStock = data?.product?.stock <= 0;

    if (loading) {
        return <p className="animate-pulse text-center">Loading insights...</p>;
    }



    return (
        <div className="space-y-4">

            {/* Product Overview */}
            <Card className="p-4">
                <h2 className="text-xl font-semibold">{data?.product?.name}</h2>
                <p>Stock: {data?.product?.stock}</p>
                <p>Avg Demand: {data?.demand?.avgDailyDemand?.toFixed(2)}</p>

                <p className="text-red-600 font-bold">
                    Stockout in: {data?.stockoutDays?.toFixed(2) || 0} days
                </p>
            </Card>

            {/* Alerts */}
            <Card className="p-4 bg-yellow-50">
                <h3 className="font-semibold">Alerts</h3>
                {data?.alerts?.length ? (
                    data?.alerts.map((a: string, i: number) => (
                        <p key={i} className="text-red-600">{a}</p>
                    ))
                ) : (
                    <p>No alerts</p>
                )}
            </Card>

            {isOutOfStock && (
                <Card className="p-4 bg-red-50">
                    <p className="text-red-600 font-semibold">
                        Out of stock
                    </p>

                    <button
                        className="mt-2 underline text-sm"
                        onClick={async () => {
                            await fetch("/api/notify", {
                                method: "POST",
                                body: JSON.stringify({
                                    productId: product._id,
                                    email: "demo@email.com",
                                }),
                            });

                            // toast({
                            //   title: "Subscribed",
                            //   description: "You will be notified when stock is back",
                            // });

                            toast.success("You will be notified when stock is back");
                        }}
                    >
                        Notify me when available
                    </button>
                </Card>
            )}

            {/* AI Insight */}
            <Card className="p-4 bg-blue-50">
                <h3 className="font-semibold">AI Recommendation</h3>
                {/* <p className="prose prose-lg dark:prose-invert">{data?.insight}</p> */}
                <AIParser content={data?.insight} />
            </Card>

            {/* Actions */}
            <Card className="p-4">
                <h3 className="font-semibold mb-2">Actions</h3>

                <AddOrder productId={product._id} onDone={() => {
                    loadInsights();
                    refreshProducts();
                }} />
            </Card>

            <Card className="p-4">
                <OrderList />
            </Card>
        </div>
    );
}