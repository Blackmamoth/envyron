import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export const OAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: "google" | "github") => {
    await authClient.signIn.social(
      {
        provider,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.button
        disabled={isLoading}
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
        disabled={isLoading}
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
  );
};
