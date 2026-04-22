"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { loginSchema } from "@/validators/auth";
import { useRouter } from "next/navigation"; 
import { toast } from "sonner";
import { SpinnerCustom } from "@/components/Spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();

const router = useRouter();
const hasShownToast = useRef(false);

useEffect(() => {
  if (status === "authenticated" && !hasShownToast.current) {
    hasShownToast.current = true;

    toast.success("You're already logged in");
    router.replace("/");
  }
}, [status]);

if (status === "loading") {
  return <SpinnerCustom/>
}


  const handleLogin = async () => {
    try {
      setLoading(true);

      const parsed = loginSchema.safeParse({
        email,
        password,
      });

      if (!parsed.success) {
        console.error("Login error:", parsed.error.flatten());
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });

      // console.log(res);
      toast.success("Login successful");

    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="password"
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          First Time Here?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}