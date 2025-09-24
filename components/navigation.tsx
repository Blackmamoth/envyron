import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Session } from "better-auth";

type Props = {
  session: Session | undefined;
};

export function Navigation({ session }: Props) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--envyron-navy)]/80 backdrop-blur-sm border-b border-[var(--envyron-teal)]/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-[var(--envyron-light-teal)] transition-colors duration-300"
          >
            Envyron
          </Link>

          <div className="flex items-center gap-4">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/blackmamoth/envyron"
              className="text-[var(--envyron-light-teal)] hover:text-white transition-colors duration-300"
            >
              GitHub
            </Link>
            {!session && (
              <Link href="/auth">
                <Button
                  size="sm"
                  className="bg-[var(--envyron-teal)] hover:bg-[var(--envyron-light-teal)] hover:text-[var(--envyron-navy)] transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
