import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-animate opacity-30" />

      {/* Back to home link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-[var(--envyron-light-teal)] hover:text-white transition-colors duration-300 z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Home</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Envyron
          </h1>
          <p className="text-[var(--envyron-light-teal)]/80">
            Sign in to start managing your configurations
          </p>
        </div>

        <AuthForm />
      </div>
    </main>
  );
}
