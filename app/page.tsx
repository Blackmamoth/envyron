import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { GitHubSection } from "@/components/github-section"
import { Footer } from "@/components/footer"

export default function LandingPage() {
	return (
		<main className="min-h-screen">
			<Navigation />
			<HeroSection />
			<FeaturesSection />
			<GitHubSection />
			<Footer />
		</main>
	)
}
