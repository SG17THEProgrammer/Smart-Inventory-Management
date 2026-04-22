"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { signOut } from "next-auth/react";
import AIParser from "@/components/AIParser";

export default function BusinessAdvisor() {
    const [data, setData] = useState<any>(null);

    const load = async () => {
        const res = await fetch("/api/ai/business");
        const json = await res.json();
        setData(json);
    };

    useEffect(() => {
        load();
    }, []);

    if (!data) return <p>Loading AI advisor...</p>;

    return (
        <>
            <Navbar
                pathname="/businessAdvisor"
                handleLogout={async () => {
                    await signOut({ callbackUrl: "/login" });
                }}
            ></Navbar>
            <Card className="p-4 bg-blue-50">
                <h2 className="font-semibold mb-2">
                    🤖 AI Business Advisor
                </h2>

                <p className="text-sm mb-2">
                    Season: <b>{data.season}</b>
                </p>

                <pre className="text-sm whitespace-pre-wrap">
                   <AIParser content = {data.advice}></AIParser>
                </pre>
            </Card>
        </>
    );
}