"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const codeSnippets = [
  {
    title: ".env",
    language: "bash",
    code: `# Database Configuration
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"
REDIS_URL="redis://localhost:6379"

# API Keys
STRIPE_SECRET_KEY="sk_test_..."
OPENAI_API_KEY="sk-..."

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="your-secret-key"`,
  },
  {
    title: "TypeScript",
    language: "typescript",
    code: `interface DatabaseConfig {
  url: string;
  maxConnections: number;
}

interface ApiKeys {
  stripe: string;
  openai: string;
}

export const config = {
  database: {
    url: process.env.DATABASE_URL!,
    maxConnections: 10
  },
  api: {
    stripe: process.env.STRIPE_SECRET_KEY!,
    openai: process.env.OPENAI_API_KEY!
  }
} as const;`,
  },
  {
    title: "Zod Schema",
    language: "typescript",
    code: `import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  JWT_SECRET: z.string().min(32)
});

export type Env = z.infer<typeof envSchema>;`,
  },
];

export function CodePreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % codeSnippets.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentSnippet = codeSnippets[currentIndex];

  return (
    <Card className="bg-[var(--envyron-navy)]/80 border-[var(--envyron-teal)]/30 backdrop-blur-sm hover:border-[var(--envyron-light-teal)]/50 transition-all duration-500">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-[var(--envyron-light-teal)] text-sm font-mono">
            {currentSnippet.title}
          </span>
        </div>

        <div className="relative min-h-[300px]">
          <pre
            className={`text-sm font-mono text-white overflow-x-auto transition-all duration-300 ${isAnimating ? "fade-out-slide" : "fade-in-slide"
              }`}
          >
            <code className="whitespace-pre-wrap break-words">
              {currentSnippet.code}
            </code>
          </pre>

          {/* Fade transition overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--envyron-navy)]/20 pointer-events-none" />
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 mt-4">
          {codeSnippets.map((value, index) => (
            <div
              key={value.title}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                ? "bg-[var(--envyron-light-teal)] pulse-animate"
                : "bg-[var(--envyron-teal)]/50 hover:bg-[var(--envyron-teal)]"
                }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
