"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function TopBar() {
  return (
    <div className="flex justify-end p-4 border-b">
      <Button onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  );
}