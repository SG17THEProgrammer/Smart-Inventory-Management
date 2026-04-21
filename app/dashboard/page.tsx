"use client";

import { useEffect, useState } from "react";
import ProductList from "@/components/ProductList";
import InsightsPanel from "@/components/InsightsPanel";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ AUTH GUARD (safe redirect)
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please login/register to access the dashboard");
      router.push("/login");
    }
  }, [status, router]);

  // ✅ Fetch products only when authenticated
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, [status]);

  // ✅ AFTER hooks, handle UI rendering
  // if (status === "loading") return <p>Loading...</p>;
  // if (!session) return null;

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 border-r p-4 bg-gray-50">
        <ProductList
          products={products}
          selected={selected}
          onSelect={setSelected}
          refresh={() => {
            fetch("/api/products")
              .then((res) => res.json())
              .then(setProducts);
          }}
        />
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-6">
        {selected ? (
          <InsightsPanel product={selected} refreshProducts={() => {}} />
        ) : (
          <p className="text-center">
            Select a product from left panel to view insights
          </p>
        )}
      </div>
    </div>
  );
}