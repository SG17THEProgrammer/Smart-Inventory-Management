"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";
import { useSession } from "next-auth/react";

export default function ProductList({
  products,
  selected,
  onSelect,
  refresh,
  page,
  setPage,
  totalPages,
  load,
}: any) {
  const [open, setOpen] = useState(false);
  const [openEditId, setOpenEditId] = useState<string | null>(null);

  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  useEffect(() => {
    load();
  }, [page]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2>Products</h2>

        <Button
          onClick={() => setOpen(!open)}
          variant="outline"
          size="sm"
          className="cursor-pointer"
          disabled={role === "supplier" || role === "user"}
        >
          +
        </Button>
      </div>

      {/* Add product */}
      {open && (
        <div className="top-16 left-4 right-4 bg-white p-4 shadow">
          <AddProduct refresh={refresh} setOpen={setOpen} />
        </div>
      )}

      {/* Product list */}
      {products.length > 0 ? (
        products.map((p: any) => {
          const isEditing = openEditId === p._id;

          return (
            <Card
              key={p._id}
              className={`p-3 ${
                selected?._id === p._id ? "border-black bg-gray-200" : ""
              }`}
            >
              <div className="flex justify-between items-center">

                {/* LEFT SIDE */}
                <div className="flex-1">
                  
                  {/* 👇 Hide when editing */}
                  {!isEditing && (
                    <div
                      className="cursor-pointer"
                      onClick={() => onSelect(p)}
                    >
                      <p className="font-medium">{p.name}</p>
                      <p
                        className={`text-sm ${
                          p.stock === 0
                            ? "text-red-500"
                            : p.stock < 10
                            ? "text-yellow-500"
                            : "text-green-600"
                        }`}
                      >
                        Stock: {p.stock}
                      </p>
                    </div>
                  )}

                  {/* 👇 Show edit form when active */}
                  {isEditing && (
                    <EditProduct
                      product={p}
                      onDone={refresh}
                      role={role}
                      isOpen={true}
                      onOpen={() => setOpenEditId(p._id)}
                      onClose={() => setOpenEditId(null)}
                    />
                  )}
                </div>

                {/* RIGHT ACTIONS */}
                {!isEditing && (
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EditProduct
                      product={p}
                      onDone={refresh}
                      role={role}
                      isOpen={false}
                      onOpen={() => setOpenEditId(p._id)}
                      onClose={() => setOpenEditId(null)}
                    />

                    <DeleteProduct
                      productId={p._id}
                      onDone={refresh}
                      role={role}
                    />
                  </div>
                )}
              </div>
            </Card>
          );
        })
      ) : (
        <h2 className="text-lg font-medium">No products found</h2>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p: any) => p - 1)}
          className={
            page === 1
              ? "px-3 py-1 border rounded disabled:opacity-50 cursor-not-allowed"
              : "px-3 py-1 border rounded cursor-pointer"
          }
        >
          ⬅️
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p: any) => p + 1)}
          className={
            page === totalPages
              ? "px-3 py-1 border rounded disabled:opacity-50 cursor-not-allowed"
              : "px-3 py-1 border rounded cursor-pointer"
          }
        >
          ➡️
        </button>
      </div>

      {/* Refresh */}
      <Button onClick={refresh} variant="outline" className="cursor-pointer">
        Refresh
      </Button>
    </div>
  );
}