import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { GitHubSection } from "@/components/github-section";
import { HeroSection } from "@/components/hero-section";
import { Navigation } from "@/components/navigation";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <GitHubSection />
      <Footer />
    </main>
  );
}
