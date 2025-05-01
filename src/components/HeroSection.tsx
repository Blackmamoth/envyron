"use client";

import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { ChevronRight, Database, Lock } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export const HeroSection = () => {
  const { data } = authClient.useSession();

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8, delay: 0.5 } },
  };

  const staggerText = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const staggerTextChild = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={staggerText}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#0B1437] dark:text-white"
          >
            {"Manage Environment Variables with Ease"
              .split(" ")
              .map((word, i) => (
                <motion.span
                  key={i}
                  variants={staggerTextChild}
                  className="inline-block mr-2"
                >
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
            A modern open source solution for developers to organize, manage,
            and deploy environment variables across your projects.
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={data?.user ? "/dashboard" : "/auth"}
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
              <div className="mx-auto text-xs text-gray-500 dark:text-gray-400">
                envyron.dev
              </div>
            </div>
            <div className="bg-white dark:bg-[#0B1437] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center">
                      <Database
                        size={18}
                        className="text-[#006D77] dark:text-[#83C5BE] mr-2"
                      />
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
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    </motion.div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center">
                      <Database
                        size={18}
                        className="text-[#006D77] dark:text-[#83C5BE] mr-2"
                      />
                      <span>Redis</span>
                    </div>
                    <div className="w-10 h-5 bg-gray-300 dark:bg-gray-700 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center">
                      <Lock
                        size={18}
                        className="text-[#006D77] dark:text-[#83C5BE] mr-2"
                      />
                      <span>Auth</span>
                    </div>
                    <div className="w-10 h-5 bg-gray-300 dark:bg-gray-700 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 font-mono text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      .env preview
                    </div>
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
                      <div className="text-[#006D77] dark:text-[#83C5BE]">
                        POSTGRES_USER=
                      </div>
                      <div className="text-[#006D77] dark:text-[#83C5BE]">
                        POSTGRES_PASSWORD=
                      </div>
                      <div className="text-[#006D77] dark:text-[#83C5BE]">
                        POSTGRES_HOST=
                      </div>
                      <div className="text-[#006D77] dark:text-[#83C5BE]">
                        POSTGRES_PORT=
                      </div>
                      <div className="text-[#006D77] dark:text-[#83C5BE]">
                        POSTGRES_DB=
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
