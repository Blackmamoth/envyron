
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Moon, Sun, ChevronRight, Code, Database, Lock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { FaGithub, FaXTwitter } from "react-icons/fa6"

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", theme === "dark")
      localStorage.setItem("theme", theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8, delay: 0.5 } },
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
        "min-h-screen bg-white text-gray-900 transition-colors duration-300",
        theme === "dark" && "dark bg-[#050A1C] text-gray-100",
      )}
    >
      {/* Navbar */}
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
                <span className="text-[#0B1437] dark:text-white mr-1">envyron</span>.dev
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
              <div className="hidden sm:flex space-x-3">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/login"
                  className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Login
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/signup"
                  className="px-4 py-2 rounded-md bg-[#006D77] hover:bg-[#006D77]/90 text-white transition-colors"
                >
                  Sign Up
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              variants={staggerText}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#0B1437] dark:text-white"
            >
              {"Manage Environment Variables with Ease".split(" ").map((word, i) => (
                <motion.span key={i} variants={staggerTextChild} className="inline-block mr-2">
                  {word}
                </motion.span>
              ))}
            </motion.div>

            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate="show"
              className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              A modern open source solution for developers to organize, manage, and deploy environment variables across
              your projects.
            </motion.p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/signup"
                className="px-6 py-3 rounded-md bg-[#006D77] hover:bg-[#006D77]/90 text-white font-medium transition-colors flex items-center justify-center"
              >
                Get Started <ChevronRight size={18} className="ml-1" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/blackmamoth/envyron"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors flex items-center justify-center"
              >
                <FaGithub size={18} className="mr-2" /> View on GitHub
              </motion.a>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative mx-auto rounded-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800"
            >
              <div className="bg-gray-100 dark:bg-gray-800 p-2 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto text-xs text-gray-500 dark:text-gray-400">envyron.dev</div>
              </div>
              <div className="bg-white dark:bg-[#0B1437] p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div className="flex items-center">
                        <Database size={18} className="text-[#006D77] dark:text-[#83C5BE] mr-2" />
                        <span>PostgreSQL</span>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-5 bg-[#83C5BE] rounded-full relative cursor-pointer"
                      >
                        <motion.div
                          className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"
                          animate={{ left: "calc(100% - 18px)" }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div className="flex items-center">
                        <Database size={18} className="text-[#006D77] dark:text-[#83C5BE] mr-2" />
                        <span>Redis</span>
                      </div>
                      <div className="w-10 h-5 bg-gray-300 dark:bg-gray-700 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div className="flex items-center">
                        <Lock size={18} className="text-[#006D77] dark:text-[#83C5BE] mr-2" />
                        <span>Auth</span>
                      </div>
                      <div className="w-10 h-5 bg-gray-300 dark:bg-gray-700 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 font-mono text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">.env preview</div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs text-[#006D77] dark:text-[#83C5BE]"
                      >
                        Copy
                      </motion.button>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      <div className="text-gray-700 dark:text-gray-300 text-left">
                        <div># PostgreSQL</div>
                        <div className="text-[#006D77] dark:text-[#83C5BE]">POSTGRES_USER=admin</div>
                        <div className="text-[#006D77] dark:text-[#83C5BE]">POSTGRES_PASSWORD=********</div>
                        <div className="text-[#006D77] dark:text-[#83C5BE]">POSTGRES_HOST=localhost</div>
                        <div className="text-[#006D77] dark:text-[#83C5BE]">POSTGRES_PORT=5432</div>
                        <div className="text-[#006D77] dark:text-[#83C5BE]">POSTGRES_DB=myapp</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-[#0B1437]/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1437] dark:text-white mb-4">Key Features</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Designed for developers who want a simple, powerful way to manage environment variables.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <motion.div variants={item} className="mb-4">
                <div className="w-12 h-12 bg-[#83C5BE]/20 rounded-lg flex items-center justify-center text-[#006D77] dark:text-[#83C5BE] mb-4">
                  <Database size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">Service-based Grouping</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Organize your environment variables by service for better clarity and management.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <motion.div variants={item} className="mb-4">
                <div className="w-12 h-12 bg-[#83C5BE]/20 rounded-lg flex items-center justify-center text-[#006D77] dark:text-[#83C5BE] mb-4">
                  <Code size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">Live .env Preview</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  See your environment file update in real-time as you make changes to your variables.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <motion.div variants={item} className="mb-4">
                <div className="w-12 h-12 bg-[#83C5BE]/20 rounded-lg flex items-center justify-center text-[#006D77] dark:text-[#83C5BE] mb-4">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">Multi-language Support</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Generate code snippets for multiple languages with a single click.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <motion.div variants={item} className="mb-4">
                <div className="w-12 h-12 bg-[#83C5BE]/20 rounded-lg flex items-center justify-center text-[#006D77] dark:text-[#83C5BE] mb-4">
                  <Lock size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">Secure by Default</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your sensitive data is encrypted and never leaves your browser without your permission.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <motion.div variants={item} className="mb-4">
                <div className="w-12 h-12 bg-[#83C5BE]/20 rounded-lg flex items-center justify-center text-[#006D77] dark:text-[#83C5BE] mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-plus-circle"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">Bulk Variable Management</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Add and edit multiple variables at once with our intuitive modal interface.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <motion.div variants={item} className="mb-4">
                <div className="w-12 h-12 bg-[#83C5BE]/20 rounded-lg flex items-center justify-center text-[#006D77] dark:text-[#83C5BE] mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check-circle"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">No SDK Required</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Use your environment variables directly without any additional dependencies.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1437] dark:text-white mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started with envyron.dev in just a few simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#006D77] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">Create Services</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add services like databases, APIs, or authentication providers to organize your variables.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#006D77] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">Add Variables</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Define your environment variables with keys, values, and mark which ones are required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#006D77] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">Export & Use</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate .env files or code snippets for your preferred language and integrate them into your project.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GitHub CTA Section */}
      <section className="py-20 bg-[#0B1437] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Open Source & Free to Use</h2>
            <p className="text-gray-300 mb-8 text-lg">
              envyron.dev is completely open source and free to use. Star us on GitHub to show your support!
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/blackmamoth/envyron"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-md bg-white text-[#0B1437] font-medium transition-colors hover:bg-gray-100"
            >
              <FaGithub size={20} className="mr-2" /> Star on GitHub
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-[#0B1437] dark:text-white font-bold mr-1">envyron</span>
              <span className="text-[#006D77] dark:text-[#83C5BE]">.dev</span>
            </div>
            <div className="flex items-center space-x-6">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://github.com/blackmamoth"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-[#006D77] dark:hover:text-[#83C5BE]"
              >
                <FaGithub size={20} />
                <span className="sr-only">GitHub</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://x.com/envyrondev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-[#006D77] dark:hover:text-[#83C5BE]"
              >
                <FaXTwitter size={20} />
                <span className="sr-only">Twitter</span>
              </motion.a>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} envyron.dev. All rights reserved.</p>
            <p className="mt-1">MIT License</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
