"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navbar from "./Navbar";
import { signOut } from "next-auth/react";
export default function SupplierDashboard() {
    const [products, setProducts] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState(0);
    const [requests, setRequests] = useState([]);

    const loadRequests: any = async () => {
        const res = await fetch("/api/restock/requests");
        const data = await res.json();
        setRequests(data);
    };

    const [newProduct, setNewProduct] = useState({
        name: "",
        sku: "",
        price: "",
    });

    const load = async () => {
        const lowRes = await fetch("/api/products/low-stock");
        const lowData = await lowRes.json();

        const allRes = await fetch("/api/products");
        const allData = await allRes.json();

        setProducts(lowData);
        setAllProducts(allData.products || allData);
    };

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        loadRequests();
    }, []);

    const restock = async () => {
        if (!selectedProduct) return;

        await fetch("/api/orders", {
            method: "POST",
            body: JSON.stringify({
                productId: selectedProduct._id,
                quantity,
                // type: "purchase",
            }),
        });

        toast.success("Restock done");

        setOpen(false);
        setSelectedProduct(null);
        load();
    };

    const approve = async (id: string, action: string) => {
        const res = await fetch(`/api/restock/${id}`, {
            method: "PUT",
            body: JSON.stringify({ action }),
        });

        if (res.ok) {
            toast.success(`Request ${action}ed`);
        }        else {
            toast.error(`Failed to ${action} request`);
        }

        loadRequests();
        load(); // refresh products also
    };

    return (
        <>
            <Navbar
                pathname="/supplier"
                handleLogout={async () => {
                    await signOut({ callbackUrl: "/login" });
                }}        ></Navbar>

            <div className="p-6 bg-white rounded-2xl shadow-md mx-4 w-90%">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Suggest New Product
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="text"
                        placeholder="Product Name"
                        className="flex-1 min-w-[160px] px-4 py-2 border border-gray-300 rounded-lg
                 placeholder-gray-400 text-gray-800
                 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        onChange={(e) =>
                            setNewProduct({ ...newProduct, name: e.target.value })
                        }
                    />

                    <input
                        type="text"
                        placeholder="SKU"
                        className="w-32 px-4 py-2 border border-gray-300 rounded-lg
                 placeholder-gray-400 text-gray-800
                 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        onChange={(e) =>
                            setNewProduct({ ...newProduct, sku: e.target.value })
                        }
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        className="w-28 px-4 py-2 border border-gray-300 rounded-lg
                 placeholder-gray-400 text-gray-800
                 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        onChange={(e) =>
                            setNewProduct({ ...newProduct, price: e.target.value })
                        }
                    />

                    <Button
                        className="bg-black hover:bg-gray-900 text-white px-5 py-2 rounded-lg transition cursor-pointer"
                        onClick={async () => {
                            if (!newProduct.name || !newProduct.sku || !newProduct.price) {
                                toast.error("Please fill all fields");
                                return;
                            }
                            const res = await fetch("/api/products/suggest", {
                                method: "POST",
                                body: JSON.stringify(newProduct),
                            });
                            if (res.ok) {
                                toast.success("Product suggestion submitted");
                                setNewProduct({ name: "", sku: "", price: "" });

                            } else {
                                toast.error("Failed to submit product suggestion");
                            }
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <h1 className="text-xl font-bold">
                    🔴 Low Stock Products
                </h1>
                <div className="grid grid-cols-8 gap-4">

                    {products.map((p) => (
                        <div
                            key={p._id}
                            className="flex justify-between border p-3 rounded"
                        >
                            <div>
                                <p className="font-medium">{p.name}</p>
                                <p
                                    className={
                                        p.stock < p.threshold
                                            ? "text-red-500"
                                            : "text-green-600"
                                    }
                                >
                                    Stock: {p.stock} / {p.threshold}
                                </p>
                            </div>

                            {/* <Button
                                size={"sm"}
                                onClick={() => {
                                    setSelectedProduct(p);
                                    setQuantity(0);
                                    setOpen(true);
                                }}
                                className="cursor-pointer"
                            >
                                Restock
                            </Button> */}
                        </div>
                    ))}
                </div>

                <h2 className=" mt-8 text-xl font-bold">
                    📦 All Products
                </h2>
                <div className="grid grid-cols-10 gap-4">
                    {open ? <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Restock Product</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">
                                    {selectedProduct?.name}
                                </p>

                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    placeholder="Enter quantity"
                                />
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={restock} className="cursor-pointer"
                                >
                                    Confirm Restock
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog> : null}
                    {allProducts.map((p) => (
                        <div key={p._id} className="border p-3 rounded mb-2 flex flex-row justify-between">
                            <div>
                                <p className="font-medium">{p.name}</p>
                                <p className="text-sm text-gray-500">
                                    Stock: {p.stock}
                                </p>
                            </div>
                            <div>
                                {/* <Button
                                    className="cursor-pointer"

                                    size={"sm"}
                                    onClick={() => {
                                        setSelectedProduct(p);
                                        setQuantity(0);
                                        setOpen(true);
                                    }}
                                >
                                    Restock
                                </Button> */}
                            </div>
                        </div>
                    ))}
                </div>


                <div className="space-y-4 mt-8 text-xl font-bold">
                    <h2 className="font-bold">📦 Restock Requests</h2>

                    {requests.length > 0 ? requests.map((r: any) => (
                        <div
                            key={r._id}
                            className="border p-4 rounded flex items-center justify-between"
                        >
                            <div>
                                <p>{r.productId.name}</p>
                                <p>Qty: {r.quantity}</p>
                            </div>
                            <div>

                                <Button
                                    onClick={() => approve(r._id, "approve")}
                                    className=" px-3 py-1 rounded mr-3 hover:bg-green-700 cursor-pointer"
                                >
                                    Approve
                                </Button>
                                <Button
                                    onClick={() => approve(r._id, "reject")}
                                    className=" px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                                >
                                    Reject
                                </Button>
                            </div>
                        </div>
                    )) : <p className="text-gray-500">No pending requests</p>}
                </div>
            </div>
        </>
    );
}