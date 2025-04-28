"use client"

import { motion } from "framer-motion"
import { Moon, Sun, Home, ArrowLeft, FileCode2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTheme } from "next-themes"

export default function NotFoundPage() {

  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const staggerText = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const staggerTextChild = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-900 transition-colors duration-300 flex flex-col",
        theme === "dark" && "dark bg-gradient-to-b from-[#050A1C] to-[#0B1437] text-gray-100",
      )}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 absolute top-4 right-4 z-10"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </motion.button>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/" className="inline-block">
            <span className="text-[#0B1437] dark:text-white font-bold text-2xl">envyron</span>
            <span className="text-[#006D77] dark:text-[#83C5BE] font-bold text-2xl">.dev</span>
          </Link>
        </motion.div>

        <div className="text-center max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mb-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <FileCode2 size={120} className="text-[#006D77]/20 dark:text-[#83C5BE]/20" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-8xl font-bold text-[#0B1437] dark:text-white relative z-10"
            >
              404
            </motion.h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-2xl font-bold text-[#0B1437] dark:text-white mb-4"
          >
            Environment Not Found
          </motion.h2>

          <motion.div
            variants={staggerText}
            initial="hidden"
            animate="visible"
            className="text-gray-600 dark:text-gray-400 mb-8"
          >
            {"The environment variable you're looking for doesn't exist or has been moved."
              .split(" ")
              .map((word, i) => (
                <motion.span key={i} variants={staggerTextChild} className="inline-block mr-1">
                  {word}
                </motion.span>
              ))}
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                href="/dashboard"
                className="flex items-center justify-center px-6 py-3 bg-[#006D77] hover:bg-[#006D77]/90 text-white rounded-md transition-colors w-full"
              >
                <Home size={18} className="mr-2" />
                Return to Dashboard
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                href="/"
                className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to Home
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        <p>© {new Date().getFullYear()} envyron.dev. All rights reserved.</p>
      </motion.div>
    </div>
  )
}
