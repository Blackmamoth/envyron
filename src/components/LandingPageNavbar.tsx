"use client";

import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const LandingPageNavbar = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const { data } = authClient.useSession();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#050A1C]/80 border-b border-gray-200 dark:border-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-[#006D77] dark:text-[#83C5BE] font-bold text-xl flex items-center"
            >
              <span className="text-[#0B1437] dark:text-white mr-1">
                envyron
              </span>
              .dev
            </motion.div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              className="text-gray-700 dark:text-gray-300 hover:text-[#006D77] dark:hover:text-[#83C5BE] transition-colors"
            >
              Features
            </motion.a>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.05 }}
              className="text-gray-700 dark:text-gray-300 hover:text-[#006D77] dark:hover:text-[#83C5BE] transition-colors"
            >
              How It Works
            </motion.a>
            <motion.a
              href="#docs"
              whileHover={{ scale: 1.05 }}
              className="text-gray-700 dark:text-gray-300 hover:text-[#006D77] dark:hover:text-[#83C5BE] transition-colors"
            >
              Docs
            </motion.a>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            {!data?.user && (
              <div className="hidden sm:flex space-x-3">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/auth?tab=signin"
                  className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Login
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/auth?tab=signup"
                  className="px-4 py-2 rounded-md bg-[#006D77] hover:bg-[#006D77]/90 text-white transition-colors"
                >
                  Sign Up
                </motion.a>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
