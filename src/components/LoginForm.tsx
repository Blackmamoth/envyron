"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "please provide a valid email address" }),
  password: z
    .string()
    .min(8, "password should consist of minimum 8 characters")
    .max(16, "password should consist of maximum 16 characters"),
  rememberMe: z.boolean().default(false).optional(),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const rememberMe = watch("rememberMe");

  const handleLogin = async ({ email, password, rememberMe }: LoginSchema) => {
    await authClient.signIn.email(
      { email, password, rememberMe: rememberMe },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          toast.success("You successfully signed into your account");
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
              placeholder="you@example.com"
              {...register("email")}
            />
            <p className="text-red-500 dark:text-[#e45858] text-sm mt-1">
              {errors.email?.message}
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
          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
              placeholder="••••••••"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>
          <p className="text-red-500 dark:text-[#e45858] text-sm mt-1">
            {errors.password?.message}
          </p>
        </div>

        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            className="flex items-center focus:outline-none"
            onClick={() => setValue("rememberMe", !rememberMe)}
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
  );
};
