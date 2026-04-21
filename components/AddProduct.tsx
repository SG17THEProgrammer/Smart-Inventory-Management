"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddProduct({ refresh, setOpen }: any) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: 0,
    stock: 0,
  });

  const submit = async () => {
    await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      sku: "",
      price: 0,
      stock: 0,
    });
    refresh();
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input placeholder="SKU" onChange={(e) => setForm({ ...form, sku: e.target.value })} />
      <Input placeholder="Price" type="number" onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
      <Input placeholder="Stock" type="number" onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />

      <Button onClick={submit}>Add Product</Button>
    </div>
  );
}