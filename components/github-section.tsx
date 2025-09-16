import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { RiGithubLine } from "react-icons/ri"

export function GitHubSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Spotlight effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--envyron-teal)]/10 to-transparent" />
      <div className="absolute inset-0 bg-[var(--envyron-navy)]/80" />

      <div className="container mx-auto relative z-10">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white text-balance">Open Source on GitHub</h2>
            <p className="text-xl text-[var(--envyron-light-teal)] text-pretty max-w-2xl mx-auto">
              Contribute to the project, report issues, or star the repository to show your support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-[var(--envyron-teal)] hover:bg-[var(--envyron-light-teal)] hover:text-[var(--envyron-navy)] transition-all duration-300 font-semibold hover:scale-105 transform"
            >
              <RiGithubLine className="w-5 h-5 mr-2" />
              View on GitHub
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-[var(--envyron-light-teal)] text-[var(--envyron-light-teal)] hover:bg-[var(--envyron-light-teal)] hover:text-[var(--envyron-navy)] transition-all duration-300 font-semibold bg-transparent hover:scale-105 transform"
            >
              <Star className="w-5 h-5 mr-2" />
              Star Repository
            </Button>
          </div>

          <div className="flex justify-center items-center gap-8 text-[var(--envyron-light-teal)]/60 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>1.2k stars</span>
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
  )
}
