"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "./ui/button";

export default function OrderList({ selected }: { selected: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"sale" | "purchase" | "all">("all");

  const load = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  const filteredOrders =
  filterType === "all"
    ? orders
    : orders.filter((o) => o.type === filterType);


 const handleFilter = (type: "sale" | "purchase" | "all") => {
  setFilterType(type);
};

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-3 h-fit">
      <div className="flex">
      <h2 className="text-lg font-semibold mr-4">Recent Orders</h2>
      <div className="flex flex-centre">
        <Button size="sm" className={filterType === "all" ? "mr-2 bg-blue-500 text-white" : "mr-2 cursor-pointer"} variant={"outline"} onClick={()=>handleFilter("all")}>All</Button>
        <Button size="sm" className={filterType === "sale" ? "mr-2 bg-blue-500 text-white" : "mr-2 cursor-pointer"} variant={"outline"} onClick={()=>handleFilter("sale")}>Sales</Button>
<Button size="sm" className={filterType === "purchase" ? "bg-blue-500 text-white" : "cursor-pointer"} variant={"outline"} onClick={()=>handleFilter("purchase")}>Purchase</Button>
      </div>
      </div>
<div className={selected ? "grid grid-cols-2 gap-4" : "grid grid-cols-6 gap-4"}>

      {filteredOrders?.map((o) => (
        <Card key={o._id} className="p-3">
          <p className="text-sm">
            {o.type.toUpperCase()} — Qty: {o.quantity}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(o.createdAt).toLocaleString()}
          </p>
        </Card>
      ))}

      {filteredOrders?.length === 0 && (
        <p className="text-sm text-gray-500">No orders yet</p>
      )}
          </div>
    </div>
  );
}