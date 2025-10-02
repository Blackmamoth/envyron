import { RiGithubLine, RiTwitterXFill } from "react-icons/ri";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[var(--envyron-teal)]/20">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[var(--envyron-light-teal)]/60">
            © 2025 Envyron. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/blackmamoth"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--envyron-light-teal)]/80 hover:text-[var(--envyron-light-teal)] transition-colors duration-300"
            >
              <RiGithubLine className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/AshpakVeetar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--envyron-light-teal)]/80 hover:text-[var(--envyron-light-teal)] transition-colors duration-300"
            >
              <RiTwitterXFill className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
