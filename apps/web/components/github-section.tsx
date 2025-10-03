import { Star } from "lucide-react";
import { RiGithubLine } from "react-icons/ri";
import Link from "next/link";

export async function GitHubSection() {
  const response = await fetch(
    "https://api.github.com/repos/blackmamoth/envyron",
  );

  const responseBody = await response.json();

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Spotlight effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--envyron-teal)]/10 to-transparent" />
      <div className="absolute inset-0 bg-[var(--envyron-navy)]/80" />

      <div className="container mx-auto relative z-10">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white text-balance">
              Open Source on GitHub
            </h2>
            <p className="text-xl text-[var(--envyron-light-teal)] text-pretty max-w-2xl mx-auto">
              Contribute to the project, report issues, or star the repository
              to show your support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="https://github.com/blackmamoth/envyron"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-md bg-[var(--envyron-teal)] text-white hover:bg-[var(--envyron-light-teal)] hover:text-[var(--envyron-navy)] transition-all duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-[var(--envyron-light-teal)] focus:ring-offset-2"
            >
              <RiGithubLine className="w-5 h-5 mr-2" />
              View on GitHub
            </Link>
          </div>

          <div className="flex justify-center items-center gap-8 text-[var(--envyron-light-teal)]/60 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>{responseBody.stargazers_count} stars</span>
            </div>
            <div className="flex items-center gap-2">
              <RiGithubLine className="w-4 h-4" />
              <span>MIT License</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Active development</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
