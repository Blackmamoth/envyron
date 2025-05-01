"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { OAuthForm } from "@/components/OAuthForm";

export default function AuthPage() {
  const { data, isPending } = authClient.useSession();

  const router = useRouter();

  useEffect(() => {
    if (!isPending && data?.session) {
      router.push("/dashboard");
    }
  }, [isPending, data?.session, router]);

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const { theme, setTheme } = useTheme();

  const searchParams = useSearchParams();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab === "signup" ? "signup" : "login");
    }
  }, [searchParams]);

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-900 transition-colors duration-300 flex items-center justify-center p-4",
        theme === "dark" &&
          "dark bg-gradient-to-b from-[#050A1C] to-[#0B1437] text-gray-100",
      )}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 absolute top-4 right-4"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <Link href="/" className="inline-block">
              <span className="text-[#0B1437] dark:text-white font-bold text-2xl">
                envyron
              </span>
              <span className="text-[#006D77] dark:text-[#83C5BE] font-bold text-2xl">
                .dev
              </span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        >
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("login")}
              className={cn(
                "flex-1 py-4 text-center font-medium transition-colors",
                activeTab === "login"
                  ? "text-[#006D77] dark:text-[#83C5BE] border-b-2 border-[#006D77] dark:border-[#83C5BE]"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
              )}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={cn(
                "flex-1 py-4 text-center font-medium transition-colors",
                activeTab === "signup"
                  ? "text-[#006D77] dark:text-[#83C5BE] border-b-2 border-[#006D77] dark:border-[#83C5BE]"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
              )}
            >
              Sign Up
            </button>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "login" ? <LoginForm /> : <RegisterForm />}

                <div className="relative flex items-center justify-center mt-6 mb-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                  </div>
                  <div className="relative px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                    or continue with
                  </div>
                </div>

                <OAuthForm />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400"
        >
          {activeTab === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() =>
              setActiveTab(activeTab === "login" ? "signup" : "login")
            }
            className="text-[#006D77] dark:text-[#83C5BE] hover:underline font-medium"
          >
            {activeTab === "login" ? "Sign up" : "Sign in"}
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}
