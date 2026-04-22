import Link from "next/link"
import { Button } from "./ui/button"
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

type NavbarProps = {
    pathname: string;
    handleLogout: () => void;
    // status: "authenticated" | "unauthenticated" | "loading";
    // session: Session | null;
};

const Navbar = ({ pathname, handleLogout }: NavbarProps) => {

    const {
        data: session, status
    } = useSession();

    const {
        name,
        email,
        role,
    } = (session?.user as any) || {};


    return (
        <nav className="flex justify-between items-center px-8 py-6 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-blue-500 after:to-transparent">

            <h1 className="text-xl font-bold tracking-wide">
                <Link href="/">
                    SmartAI
                </Link>

                {pathname === "/dashboard" && "   - Admin Dashboard"}
            </h1>

            <div className="flex gap-10 items-center">

                <Link href="/shop"
                >
                    {pathname === "/shop" ? "" : role === "user" || role === "admin" ? "Shop" : ""}
                </Link>

                <Link href="/admin/suggestions"
                    className={pathname === "/admin/suggestions" ? "underline" : ""}
                >
                    {pathname === "/admin/suggestions" ? "" : role === "admin" ? "Product Suggestions" : ""}
                </Link>


                <Link href="/businessAdvisor"
                    className={pathname === "/businessAdvisor" ? "underline" : ""}
                >
                    {pathname === "/businessAdvisor" ? "" : role === "admin" ? "AI Business Advisor" : ""}
                </Link>

                {(role === "supplier" || role === "admin") && (
                    <Link href="/supplier">
                        {pathname === "/supplier" ? "" : "Demands"}
                    </Link>
                )}

                <Link href="/dashboard"
                    className={pathname === "/dashboard" ? "underline" : ""}
                >
                    {pathname === "/dashboard" ? "" : role === "admin" ? "Dashboard" : ""}
                </Link>

                {status === "authenticated" && (
                    <div className={pathname === "/dashboard" || pathname === "/businessAdvisor" || pathname === "/supplier" || pathname === "/admin/suggestions" || pathname === "/shop" ? "flex flex-col text-black leading-tight border rounded px-2 py-1" : "flex flex-col text-white leading-tight border rounded px-2 py-1"}>
                        <span className="text-sm font-semibold">
                            {name || "No Name"} {role === "admin" ? "(Admin)" : role === "supplier" ? "(Supplier)" : "(User)"}
                        </span>
                        <span className={pathname === "/dashboard" || pathname === "/businessAdvisor" || pathname === "/supplier" || pathname === "/admin/suggestions" || pathname === "/shop" ? "text-xs text-gray-600" : "text-xs text-gray-200"}>
                            {email}
                        </span>
                    </div>
                )}

                {status === "unauthenticated" && <>
                    <Link href="/login">
                        <Button variant="secondary" className="cursor-pointer">Login</Button>
                    </Link>

                    <Link href="/register">
                        <Button className="bg-white text-black hover:bg-gray-200 cursor-pointer">
                            Register
                        </Button>
                    </Link></>}

                {status === "authenticated" && (
                    <Button variant="destructive" className="cursor-pointer" onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </div>
        </nav>
    )
}

export default Navbar