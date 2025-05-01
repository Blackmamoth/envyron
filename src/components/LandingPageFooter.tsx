import { motion } from "framer-motion";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

export const LandingPageFooter = () => {
  return (
    <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-[#0B1437] dark:text-white font-bold mr-1">
              envyron
            </span>
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
  );
};
