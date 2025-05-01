"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { LandingPageNavbar } from "@/components/LandingPageNavbar";
import { HeroSection } from "@/components/HeroSection";
import { FeatureSection } from "@/components/FeatureSection";
import { HowItWorkSection } from "@/components/HowItWorks";
import { GithubCTA } from "@/components/GithubCTA";
import { LandingPageFooter } from "@/components/LandingPageFooter";

export default function LandingPage() {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "min-h-screen bg-white text-gray-900 transition-colors duration-300",
        theme === "dark" && "dark bg-[#050A1C] text-gray-100",
      )}
    >
      {/* Navbar */}
      <LandingPageNavbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />

      {/* How It Works Section */}
      <HowItWorkSection />

      {/* GitHub CTA Section */}
      <GithubCTA />

      {/* Footer */}
      <LandingPageFooter />
    </div>
  );
}
