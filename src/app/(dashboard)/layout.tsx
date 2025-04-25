"use client"

import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  const { theme } = useTheme()

  return (

    <div
      className={cn(
        "min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300",
        theme === "dark" && "dark bg-[#050A1C] text-gray-100",
      )}
    >
      <Navbar />
      {children}
    </div>

  )
}
