"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes"

const loginSchema = z.object({
  email: z.string().email({ message: "please provide a valid email address" }),
  password: z.string()
    .min(8, "password should consist of minimum 8 characters")
    .max(16, "password should consist of maximum 16 characters"),
  rememberMe: z.boolean().default(false).optional(),
})

const registerSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email({ message: "please provide a valid email address" }),
  password: z.string()
    .min(8, "password should consist of minimum 8 characters")
    .max(16, "password should consist of maximum 16 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
      "Password should consist of at least one uppercase letter, one lowercase letter, one number, and one special character")
})

type LoginSchema = z.infer<typeof loginSchema>

type RegisterSchema = z.infer<typeof registerSchema>

export default function AuthPage() {


  const { data, isPending } = authClient.useSession()

  const router = useRouter()

  useEffect(() => {
    if (!isPending && data?.session) {
      router.push("/dashboard")
    }
  }, [isPending, data?.session, router])

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { theme, setTheme } = useTheme()

  const searchParams = useSearchParams()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };


  const loginForm = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) })

  const rememberMe = loginForm.watch("rememberMe")

  const registerForm = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) })

  const password = registerForm.watch("password")

  const handleLogin = async ({ email, password, rememberMe }: LoginSchema) => {
    await authClient.signIn.email({ email, password, rememberMe: rememberMe }, {
      onRequest: () => setIsLoading(true),
      onSuccess: () => {
        setIsLoading(false)
        toast.success("You successfully signed into your account")
        router.push("/dashboard")
      },
      onError: (ctx) => {
        setIsLoading(false)
        toast.error(ctx.error.message)
      }

    })
  }

  const handleRegister = async ({ name, email, password }: RegisterSchema) => {
    await authClient.signUp.email({ name, email, password }, {
      onRequest: () => setIsLoading(true),
      onSuccess: () => {
        setIsLoading(false)
        toast.success("Your registration was successful")
        router.push("/dashboard")
      },
      onError: (ctx) => {
        setIsLoading(false)
        toast.error(ctx.error.message)
      }
    })
  }

  const handleSocialLogin = async (provider: "google" | "github") => {
    await authClient.signIn.social({
      provider,
    }, {
      onRequest: () => setIsLoading(true),
      onSuccess: () => {
        setIsLoading(false)
      },
      onError: (ctx) => {
        setIsLoading(false)
        toast.error(ctx.error.message)
      }
    })
  }


  const getPasswordStrength = (password: string) => {
    if (typeof password !== "string") return 0;

    let strength = 0;

    if (password.length < 8) {
      return 1
    }

    if (password.length >= 8 && password.length <= 16) {
      if (/[a-z]/.test(password)) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
    }

    return strength;
  };


  const getPasswordStrengthText = () => {
    const strength = getPasswordStrength(password);
    if (strength === 0) return "";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength(password);
    if (strength === 0) return "bg-gray-200 dark:bg-gray-700";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-green-400";
    return "bg-green-500";
  };

  useEffect(() => {
    loginForm.reset()
    registerForm.reset()
  }, [activeTab, loginForm, registerForm])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab === "signup" ? "signup" : "login")
    }
  }, [searchParams])

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
                {activeTab === "login" ? (
                  <>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Email
                          </label>
                          <motion.div
                            whileFocus={{ scale: 1.01 }}
                            className="relative"
                          >
                            <input
                              id="email"
                              type="email"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
                              placeholder="you@example.com"
                              {...loginForm.register("email")}
                            />
                            <p className="text-red-500 dark:text-[#e45858] text-sm mt-1">
                              {loginForm.formState.errors.email?.message}
                            </p>
                          </motion.div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label
                              htmlFor="password"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Password
                            </label>
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              href="/forgot-password"
                              className="text-sm text-[#006D77] dark:text-[#83C5BE] hover:underline"
                            >
                              Forgot password?
                            </motion.a>
                          </div>
                          <motion.div
                            whileFocus={{ scale: 1.01 }}
                            className="relative"
                          >
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
                              placeholder="••••••••"
                              {...loginForm.register("password")}
                            />

                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>

                          </motion.div>
                          <p className="text-red-500 dark:text-[#e45858] text-sm mt-1">
                            {loginForm.formState.errors.password?.message}
                          </p>
                        </div>

                        <div className="flex items-center">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="flex items-center focus:outline-none"
                            onClick={() => loginForm.setValue("rememberMe", !rememberMe)}
                          >
                            <div className="relative w-10 h-5 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors duration-300 ease-in-out mr-3">
                              <div
                                className={cn(
                                  "absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition-transform duration-300 ease-in-out",
                                  rememberMe
                                    ? "transform translate-x-5 bg-[#006D77] dark:bg-[#83C5BE]"
                                    : "bg-white",
                                )}
                              />
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Remember me
                            </span>
                          </motion.button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-2 px-4 bg-[#006D77] hover:bg-[#006D77]/90 text-white rounded-md font-medium transition-colors flex items-center justify-center"
                        >
                          {isLoading ? (
                            <Loader2 size={18} className="animate-spin mr-2" />
                          ) : null}
                          Sign In
                        </motion.button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                      <div className="space-y-4">

                        <div className="space-y-2">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Name
                          </label>
                          <motion.div
                            whileFocus={{ scale: 1.01 }}
                            className="relative"
                          >
                            <input
                              id="name"
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
                              placeholder="John Doe"
                              {...registerForm.register("name")}
                            />
                            <p className="text-red-500 dark:text-[#e45858] text-sm mt-1">
                              {registerForm.formState.errors.name?.message}
                            </p>
                          </motion.div>
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Email
                          </label>
                          <motion.div
                            whileFocus={{ scale: 1.01 }}
                            className="relative"
                          >
                            <input
                              id="email"
                              type="email"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
                              placeholder="you@example.com"
                              {...registerForm.register("email")}

                            />
                            <p className="text-red-500 dark:text-[#e45858] text-sm mt-1">
                              {registerForm.formState.errors.email?.message}
                            </p>
                          </motion.div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label
                              htmlFor="password"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Password
                            </label>
                          </div>
                          <motion.div
                            whileFocus={{ scale: 1.01 }}
                            className="relative"
                          >
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
                              placeholder={"Create a password"}
                              {...registerForm.register("password")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>

                          </motion.div>
                          <p className="text-red-500 dark:text-[#e45858] text-sm mt-1">
                            {registerForm.formState.errors.password?.message}
                          </p>
                          {activeTab === "signup" && password?.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-2"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${getPasswordStrength(password) * 25}%`,
                                    }}
                                    className={cn(
                                      "h-full",
                                      getPasswordStrengthColor(),
                                    )}
                                    transition={{ duration: 0.3 }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px]">
                                  {getPasswordStrengthText()}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-2 px-4 bg-[#006D77] hover:bg-[#006D77]/90 text-white rounded-md font-medium transition-colors flex items-center justify-center"
                        >
                          {isLoading ? (
                            <Loader2 size={18} className="animate-spin mr-2" />
                          ) : null}
                          Create Account
                        </motion.button>
                      </div>
                    </form>
                  </>
                )}

                <div className="relative flex items-center justify-center mt-6 mb-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                  </div>
                  <div className="relative px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                    or continue with
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSocialLogin("google")}
                  >
                    <FcGoogle size={20} className="mr-2" />
                    Google
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSocialLogin("github")}
                  >
                    <FaGithub size={20} className="mr-2" />
                    GitHub
                  </motion.button>
                </div>
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
