"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
const orders = () => {
    const [userOrders, setUserOrders] = useState<any[]>([]);
    const [restockOrders, setRestockOrders] = useState<any[]>([]);

    const load = async () => {
        try {
    const res = await fetch("/api/allOrders");

    // console.log("STATUS:", res.status);

    const text = await res.text();
    // console.log("RAW RESPONSE:", text);

    const data = text ? JSON.parse(text) : {}; // safe parse

    // console.log(data);

    setUserOrders(data.orders || []);
    setRestockOrders(data.restock || []);
  } catch (error) {
    console.error("Failed to load orders:", error);
  }
    };


    useEffect(() => {
        load();
    }, []);

    const getStatusStyles = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "approved":
      return "bg-green-100 text-green-800 border-green-300";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "";
  }
};

    return (
        <>
            <Navbar
                handleLogout={async () => {
                          await signOut({ callbackUrl: "/login" });
                          toast.success("Logged out successfully");
                        }}
                pathname="/orders"
            />
            <div className="grid gap-6 md:grid-cols-2 mt-4 mx-4">

                {/* User Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            All User Orders
                            <Badge variant="secondary">{userOrders.length}</Badge>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {userOrders.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No user orders</p>
                        ) : (
                            <ul className="space-y-3">
                                {userOrders.map((order) => (
                                    <li
                                        key={order._id}
                                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted transition"
                                    >
                                        <span className="font-medium">
                                            {order.productId.name}
                                        </span>
                                        <span className="font-medium">
                                            {order.userId.email}
                                        </span>
                                       

                                        <Badge variant="outline">{order.quantity}</Badge>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                {/* Restock Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Restock Orders
                            <Badge variant="secondary">{restockOrders.length}</Badge>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {restockOrders.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No restock orders</p>
                        ) : (
                            <ul className="space-y-3">
                                {restockOrders.map((order) => (
                                    <li
                                        key={order._id}
                                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted transition"
                                    >
                                        <span className="font-medium">
                                            {order.productId.name}
                                        </span>
                                        <span className="font-medium">
                                            {order.quantity}
                                        </span>
                                        <span className="font-medium">
                                            {order.requestedBy.email}
                                        </span>
                                        <Badge className={getStatusStyles(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </li>
                        ))}
                    </ul>
          )}
                </CardContent>
            </Card>

        </div >
    </>
  )
}

export default orders