"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Recent Orders</h2>

      {orders.map((o) => (
        <Card key={o._id} className="p-3">
          <p className="text-sm">
            {o.type.toUpperCase()} — Qty: {o.quantity}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(o.createdAt).toLocaleString()}
          </p>
        </Card>
      ))}

      {orders.length === 0 && (
        <p className="text-sm text-gray-500">No orders yet</p>
      )}
    </div>
  );
}