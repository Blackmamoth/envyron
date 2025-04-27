"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import {
  Moon,
  Sun,
  ChevronDown,
  Database,
  Server,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <Server size={18} className="mr-2" /> },
    { href: '/services', label: 'Services', icon: <Database size={18} className="mr-2" /> }
  ]

  const pathname = usePathname()

  const router = useRouter()

  const { data, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending) {
      if (!data?.user && !data?.session) {
        router.push("/auth")
      }
    }
  }, [isPending, data?.user, data?.session])

  return (
    <>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-lg lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-[#0B1437] dark:text-white font-bold text-xl">envyron</span>
                <span className="text-[#006D77] dark:text-[#83C5BE] font-bold text-xl">.dev</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                    pathname === href
                      ? 'bg-gray-100 dark:bg-gray-700 text-[#006D77] dark:text-[#83C5BE]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header/Navbar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1 mr-3 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 lg:hidden"
              >
                <Menu size={20} />
              </button>
              <Link href="/" className="flex items-center">
                <span className="text-[#0B1437] dark:text-white font-bold text-xl">envyron</span>
                <span className="text-[#006D77] dark:text-[#83C5BE] font-bold text-xl">.dev</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex ml-8 space-x-4">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'px-3 py-2 text-sm font-medium rounded-md',
                      pathname === href
                        ? 'bg-gray-100 dark:bg-gray-700 text-[#006D77] dark:text-[#83C5BE]'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-[#006D77] dark:bg-[#83C5BE] flex items-center justify-center text-white">

                    <Avatar>
                      <AvatarImage src={data?.user?.image || ""} />
                      <AvatarFallback>{data?.user.name.split(" ").map(word => word[0])}</AvatarFallback>
                    </Avatar>
                  </div>
                  <ChevronDown size={16} className={cn("transition-transform", userMenuOpen ? "rotate-180" : "")} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                    >

                      <button
                        type="button"
                        onClick={() => authClient.signOut()}
                        className="block w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
