"use client";

import { useEffect, useRef, useState } from "react";
import ProductList from "@/components/ProductList";
import InsightsPanel from "@/components/InsightsPanel";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SpinnerCustom } from "@/components/Spinner";
import Navbar from "@/components/Navbar";
import OrderList from "@/components/OrderList";
import { Card } from "@/components/ui/card";
import AnalyticsCharts from "@/components/AnalyticsCharts";

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const hasShownToast = useRef(false);

  const {
    data: session, status
  } = useSession();

  const role = (session?.user as any)?.role;


  // --------------------
  // FUNCTIONS
  // --------------------
  const load = async () => {
    const res = await fetch(`/api/products?page=${page}&limit=5`);
    const data = await res.json();

    setProducts(data.products);
    setTotalPages(data.totalPages);
  };

  const loadAnalytics = async () => {
    const res = await fetch("/api/analytics");
    const data = await res.json();
    setAnalyticsData(data);
  };


    // --------------------
  // USE EFFECTS
  // --------------------

  useEffect(() => {
    if (role === "supplier") {
      router.push("/");
    }
  }, [role]);


  // ✅ AUTH GUARD (safe redirect)
  useEffect(() => {
    if (status === "unauthenticated" && !hasShownToast.current) {
      hasShownToast.current = true;
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
    loadAnalytics();
    load();
  }, [status]);


  useEffect(() => {
    load();
  }, [page])

  // --------------------
  // EARLY RETURN (ONLY AFTER ALL HOOKS)
  // --------------------
  if (status === "loading") {
    return <SpinnerCustom />;
  }


  return (
    <div>
      <Navbar
        pathname={"/dashboard"}
        // status={status}
        // session={session}
        handleLogout={async () => {
          await signOut({ callbackUrl: "/login" });
        }}
      />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 border-r p-4 bg-gray-50">
          <ProductList
            products={products}
            selected={selected}
            onSelect={setSelected}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            load={load}
            refresh={() => {
              fetch("/api/products")
                .then((res) => res.json())
                .then(setProducts);
            }}
          />
        </div>

        {/* Main Panel */}
        <div className="flex-1 ">
          {selected ? (
            <InsightsPanel product={selected} refreshProducts={() => { }} />
          ) : (
            <p className="text-center mt-4">
              Select a product from left panel to view insights
            </p>
          )}
        </div>
      </div>

      <div
        className={
          selected
            ? "grid grid-cols-[30%_70%] gap-2 px-2"
            : "flex flex-col gap-2 px-2"
        }>
        <Card className="p-4 mt-4">
          <OrderList selected={selected} />
        </Card>

        {selected && (
          <Card className="p-4 mr-4 mt-4">
            <AnalyticsCharts data={analyticsData} />
          </Card>
        )}
      </div>
    </div>
  );
}