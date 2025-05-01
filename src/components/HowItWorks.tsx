import { motion } from "framer-motion";

export const HowItWorkSection = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1437] dark:text-white mb-4">
            How It Works
          </h2>
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
            <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">
              Create Services
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Organize your environment variable keys by grouping them into
              services like databases, APIs, or authentication providers.
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
            <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">
              Define Variables
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add keys and optionally mark them as required. The required flag
              helps with code validation but doesn’t affect which variables
              appear in the output.
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
            <h3 className="text-xl font-semibold text-[#0B1437] dark:text-white mb-2">
              Copy and Integrate
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate .env content or language-specific code snippets. Use the
              copy button to grab what you need and drop it into your project.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
