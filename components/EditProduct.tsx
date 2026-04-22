"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditProduct({
  product,
  onDone,
  role,
  isOpen,
  onOpen,
  onClose,
}: any) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
  });

  // 🔥 sync form when product changes
  useEffect(() => {
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
  }, [product]);

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
    onClose();   // close modal
    onDone();
  };

  return (
    <div>
      {/* Hide button when open */}
      {!isOpen && (
        <Button
          size="sm"
          variant="outline"
          onClick={onOpen}
          className="cursor-pointer"
          disabled={role === "supplier" || role === "user"}
        >
          Edit
        </Button>
      )}

      {/* Show form when open */}
      {isOpen && (
        <div className="space-y-2 mt-2">
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

            <Button size="sm" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}