import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { GitHubSection } from "@/components/github-section";
import { HeroSection } from "@/components/hero-section";
import { Navigation } from "@/components/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main className="min-h-screen">
      <Navigation session={session?.session} />
      <HeroSection session={session?.session} />
      <FeaturesSection />
      <GitHubSection />
      <Footer />
    </main>
  );
}
