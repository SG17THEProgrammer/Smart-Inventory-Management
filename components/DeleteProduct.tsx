"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DeleteProduct({ productId, onDone , role }: any) {
  const remove = async () => {
    const confirmDelete = confirm("Delete this product?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error);
      return;
    }

    toast.success("Deleted");
    onDone();
  };

  return (
    <Button size="sm" variant="destructive" onClick={remove} className="cursor-pointer" disabled={role==="supplier" || role==="user"}>
      Delete
    </Button>
  );
}