"use client";

import { useSession } from "next-auth/react";
import SupplierDashboard from "@/components/SupplierDashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SupplierPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  if (role !== "supplier") {
    return (<div className="p-6 text-center">
    <p className="text-center font-bold text-2xl mb-3">Access denied</p>
    <Link href="/">
      <Button className="cursor-pointer">Go To Home</Button>
    </Link>
    </div>)
  }

  return <SupplierDashboard />;
}