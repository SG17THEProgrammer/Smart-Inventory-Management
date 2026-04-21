"use client";

import { Toaster } from "sonner";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}