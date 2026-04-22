"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { toast } from "sonner";

export default function SuggestionsPage() {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;

  const [data, setData] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch("/api/products/suggestions");
    if (!res.ok) {
      setData([]);
      return;
    }
    else {
      const json = await res.json();
      setData(json);
    }
  };

  const approve = async (id: string) => {
    const res = await fetch(`/api/products/suggestions/${id}`, {
      method: "PUT",
    });

    console.log(res);

    if (!res.ok) {
      toast.error("Failed to approve suggestion");
    } else {
      toast.success("Suggestion approved and product created!");
      load();
    }
  };

  const reject = async (id: string) => {
    const res = await fetch(`/api/products/suggestions/${id}`, {
      method: "PATCH",
    });

    if (!res.ok) {
      toast.error("Failed to reject suggestion");
    } else {
      toast.success("Suggestion rejected.");
      load();
    }
  };

  const deleteSuggestion = async (id: string) => {
    const res = await fetch(`/api/products/suggestions/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Failed to delete suggestion");
    } else {
      toast.success("Suggestion deleted.");
      load();
    }
  };

  useEffect(() => {
    if (role === "admin") {
      load();
    }
  }, [role]);

  // ✅ handle loading state first
  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  // ✅ then role check
  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
        </p>
        <Link href="/">
          <Button className="cursor-pointer">Go to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar
        pathname="/admin/suggestions"
        handleLogout={async () => {
          await signOut({ callbackUrl: "/login" });
        }}
      />

      <div className="p-6 space-y-4">
        <h1 className="text-xl font-bold">Product Suggestions</h1>
        <hr />

        {data.length > 0 ? (
          data.map((s) => (
            <div
              key={s._id}
              className="border p-4 rounded flex justify-between"
            >
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-gray-500">
                  SKU: {s.sku} | Price: ₹{s.price}
                </p>
                <p
                  className={`text-xs ${s.status === "approved"
                    ? "text-green-600"
                    : s.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                    }`}
                >
                  Status: {s.status}
                </p>
              </div>

              {s.status === "pending" ? (<>
                <div className="space-x-2">
                  <Button className="cursor-pointer" onClick={() => approve(s._id)}>
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => reject(s._id)}
                  >
                    Reject
                  </Button>
                </div></>) : <Button variant="destructive" className="cursor-pointer" onClick={() => deleteSuggestion(s._id)}
                >Remove from suggestions</Button>}
            </div>
          ))
        ) : (
          <h1 className="text-xl font-bold text-center">
            No suggestions available
          </h1>
        )}
      </div>
    </>
  );
}