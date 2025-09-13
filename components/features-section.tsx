import { Card } from "@/components/ui/card"
import { Settings, FileText, Code } from "lucide-react"

const features = [
	{
		icon: Settings,
		title: "Create Services",
		description: "Define environment variables quickly with our intuitive interface and smart templates.",
	},
	{
		icon: FileText,
		title: "Build Templates",
		description: "Reuse configurations across projects with shareable, version-controlled templates.",
	},
	{
		icon: Code,
		title: "Generate Snippets",
		description: "Instantly export .env files, TypeScript configs, and Zod validation schemas.",
	},
]

export function FeaturesSection() {
	return (
		<section className="py-24 px-6">
			<div className="container mx-auto">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-white mb-4 text-balance">
						Everything you need to manage configurations
					</h2>
					<p className="text-xl text-[var(--envyron-light-teal)] text-pretty max-w-2xl mx-auto">
						Streamline your development workflow with powerful tools for environment management.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 hover:border-[var(--envyron-light-teal)]/60 transition-all duration-300 backdrop-blur-sm group"
						>
							<div className="p-8 text-center">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--envyron-teal)]/20 mb-6 group-hover:bg-[var(--envyron-light-teal)]/20 transition-colors duration-300">
									<feature.icon className="w-8 h-8 text-[var(--envyron-light-teal)]" />
								</div>
								<h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
								<p className="text-[var(--envyron-light-teal)]/80 leading-relaxed">{feature.description}</p>
							</div>
						</Card>
					))}
				</div>
			</div>
		</section>
	)
}
