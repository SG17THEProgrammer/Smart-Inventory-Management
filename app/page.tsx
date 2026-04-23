"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react";
import Navbar from "@/components/Navbar"
import { SpinnerCustom } from "@/components/Spinner"
import { toast } from "sonner"

export default function Page() {

  const { data: session, status } = useSession();
  const pathname = usePathname()
  const [api, setApi] = useState<any>(null)
  const titles = ["AI PROCESSING", "INVENTORY DATA", "DEMAND PREDICTION"]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  const intervalRef = useRef(null as any);

  useEffect(() => {
    if (!api || intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [api]);



  const handleLogout = async () => {
    toast.success("Logged out successfully");
    await signOut({ callbackUrl: "/login" });
  }

  if (status === "loading") {
    return <SpinnerCustom />
  }


  // console.log(session);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white overflow-hidden">

      {/* Navbar */}
      <Navbar
        pathname={pathname}
        // status={status}
        // session={session}
        handleLogout={handleLogout}
      />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-10">

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold max-w-4xl leading-tight"
        >
          Smart Inventory + Demand Forecasting for Small Businesses
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-lg max-w-2xl opacity-90"
        >
          Stop guessing what to stock. Our intelligent system analyzes your sales patterns,
          predicts future demand, and ensures your shelves are always optimized.
        </motion.p>

      </div>

      {/* Carousel */}
      <div className="flex justify-center mt-16">
        <div className="max-w-[45%] relative">



          {/* CAROUSEL */}
          <Carousel
            // api={api}
            setApi={setApi}
            opts={{
              loop: true,   // 🔥 THIS FIXES YOUR ISSUE
            }}
          >
            <CarouselContent>

              <CarouselItem>
                <img src="/images/ai.jpg" className="w-full object-cover h-[400px] border-2 border-white" />
              </CarouselItem>

              <CarouselItem>
                <img src="/images/inventory.jpg" className="w-full object-cover h-[400px] border-2 border-white" />
              </CarouselItem>

              <CarouselItem>
                <img src="/images/demand.jpg" className="w-full object-cover h-[400px] border-2 border-white" />
              </CarouselItem>

            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* BIG TRANSPARENT TEXT */}
          <div className="inset-0 flex items-end justify-center z-10 pointer-events-none pt-5">
            <h1 className="
            text-5xl md:text-5xl
            font-extrabold
            tracking-[0.3em]
            text-transparent
            bg-clip-text
            bg-white/95
            opacity-80
            text-center
            
          ">
              {titles[index]}
            </h1>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24 grid md:grid-cols-3 gap-8 px-8 max-w-6xl mx-auto">

        {[
          {
            title: "Real-Time Inventory Tracking",
            desc: "Monitor stock levels across products and locations with live updates."
          },
          {
            title: "AI Demand Forecasting",
            desc: "Predict future demand using historical sales and trends."
          },
          {
            title: "Smart Restocking",
            desc: "Get automated suggestions on when and how much to reorder."
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm opacity-80">{item.desc}</p>
          </motion.div>
        ))}

      </div>

      {/* Constant Background Animation */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="w-[500px] h-[500px] bg-purple-400 rounded-full blur-3xl opacity-20 absolute top-0 left-0"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
        />
        <motion.div
          className="w-[400px] h-[400px] bg-pink-400 rounded-full blur-3xl opacity-20 absolute bottom-0 right-0"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
        />
      </div>

      {/* CTA Section */}
      <div className="text-center mt-24 pb-16 px-6">
        <h2 className="text-3xl font-bold">
          Make smarter business decisions today
        </h2>

        <p className="mt-4 opacity-80">
          Join small businesses already optimizing their inventory with AI.
        </p>

        {status === "authenticated" ? "" : <><div className="mt-6 flex justify-center gap-4">
          <Link href="/register">
            <Button className="bg-white text-black cursor-pointer hover:bg-gray-400 hover:text-white">Get Started</Button>
          </Link>

          <Link href="/login">
            <Button variant="secondary" className="cursor-pointer">Login</Button>
          </Link>
        </div></>}
      </div>

      {/* Footer */}
      <footer className="w-full border-t mt-10 py-6 bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-700">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-white">

          {/* Name */}
          <p className="mb-2 md:mb-0">
            © {new Date().getFullYear()} Shray Gupta
          </p>

          {/* Links */}
          <div className="flex gap-4">
            <a
              href="https://github.com/SG17THEProgrammer"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition"
            >
              GitHub
            </a>

            <a
              href="http://linkedin.com/in/shray-gupta-672a92224/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}