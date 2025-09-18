import Link from "next/link";
import { CodePreview } from "@/components/code-preview";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-animate opacity-90" />

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white text-balance">
                Standardize your environment.
              </h1>
              <p className="text-xl text-[var(--envyron-light-teal)] text-pretty max-w-lg">
                Build once, reuse everywhere.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-[var(--envyron-teal)] hover:bg-[var(--envyron-light-teal)] hover:text-[var(--envyron-navy)] transition-all duration-300 font-semibold glow-on-hover hover:scale-105 transform"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Code Preview */}
          <div className="lg:pl-8">
            <CodePreview />
          </div>
        </div>
      </div>
    </section>
  );
}
