"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SpinnerCustom } from "@/components/Spinner";

export default function Register() {
  const [loading, setLoading] = useState(false);

    const { data: session, status } = useSession();
  
  const router = useRouter();
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    if (status === "authenticated" && !hasShownToast.current) {
      hasShownToast.current = true;
  
      toast.success("You're already registered");
      router.replace("/");
    }
  }, [status, router]);
  
  if (status === "loading") {
    return <SpinnerCustom/>
  }

  // form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "supplier">("user");

  const register = async (form: {
    name: string;
    email: string;
    password: string;
    role: "admin" | "supplier" | "user";
  }) => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // console.log(data);

      if (!res.ok) {
        const errorMessage =
          Object.values(data.error as Record<string, string[]>)?.[0]?.[0] ??
          "Registration failed";

        throw new Error(errorMessage);
      }

      toast.success("Account created successfully");
      return data;
    } catch (error: any) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    const result = await register({
      name,
      email,
      password,
      role,
    });



    if (result) {
      //  redirect
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-700">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded-md"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "user"  | "supplier")
          }
        >
          <option value="user">User</option>
          <option value="supplier">Supplier</option>
          {/* <option value="admin">Admin</option> */}
        </select>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already been here?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}