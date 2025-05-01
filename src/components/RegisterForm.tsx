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

const registerSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email({ message: "please provide a valid email address" }),
  password: z
    .string()
    .min(8, "password should consist of minimum 8 characters")
    .max(16, "password should consist of maximum 16 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
      "Password should consist of at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

type RegisterSchema = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");

  const handleRegister = async ({ name, email, password }: RegisterSchema) => {
    await authClient.signUp.email(
      { name, email, password },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Your registration was successful");
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message);
        },
      },
    );
  };

  const getPasswordStrength = (password: string) => {
    if (typeof password !== "string") return 0;

    let strength = 0;

    if (password.length < 8) {
      return 1;
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

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
            <input
              id="name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
              placeholder="John Doe"
              {...register("name")}
            />
            <p className="text-red-500 dark:text-[#e45858] text-sm mt-1">
              {errors.name?.message}
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
          </div>
          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006D77] dark:focus:ring-[#83C5BE] transition-all"
              placeholder={"Create a password"}
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
          {password?.length > 0 && (
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
                    className={cn("h-full", getPasswordStrengthColor())}
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
  );
};
