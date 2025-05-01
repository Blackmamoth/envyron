import { motion } from "framer-motion";
import { Code, Database, Lock, Zap } from "lucide-react";

export const FeatureSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-[#0B1437]/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1437] dark:text-white mb-4">
            Key Features
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Designed for developers who want a simple, powerful way to manage
            environment variables.
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
              <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">
                Service-based Grouping
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organize your environment variables by service for better
                clarity and management.
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
              <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">
                Live .env Preview
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                See your environment file update in real-time as you make
                changes to your variables.
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
              <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">
                Multi-language Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate code snippets for multiple languages with a single
                click.
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
              <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">
                Secure by Default
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your sensitive data is encrypted and never leaves your browser
                without your permission.
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
              <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">
                Bulk Variable Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add and edit multiple variables at once with our intuitive modal
                interface.
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
              <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">
                No SDK Required
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use your environment variables directly without any additional
                dependencies.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
