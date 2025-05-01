import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa6";

export const GithubCTA = () => {
  return (
    <section className="py-20 bg-[#0B1437] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Open Source & Free to Use
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            envyron.dev is completely open source and free to use. Star us on
            GitHub to show your support!
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
  );
};
