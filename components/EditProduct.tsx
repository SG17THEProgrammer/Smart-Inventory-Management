"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditProduct({ product, onDone }: any) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
  });

  const [editing, setEditing] = useState(false);

  const save = async () => {
    const res = await fetch(`/api/products/${product._id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error);
      return;
    }

    toast.success("Updated successfully");
    setEditing(false);
    onDone();
  };

  if (!editing) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => setEditing(true)}
        className="cursor-pointer"
      >
        Edit
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Input
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <Input
        type="number"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: Number(e.target.value) })
        }
      />

      <Input
        type="number"
        value={form.stock}
        onChange={(e) =>
          setForm({ ...form, stock: Number(e.target.value) })
        }
      />

      <div className="flex gap-2">
        <Button size="sm" onClick={save}>
          Save
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditing(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}