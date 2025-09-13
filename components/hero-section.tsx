import { Button } from "@/components/ui/button"
import { CodePreview } from "@/components/code-preview"
import { Github } from "lucide-react"
import Link from "next/link"

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
							<h1 className="text-5xl lg:text-6xl font-bold text-white text-balance">Standardize your environment.</h1>
							<p className="text-xl text-[var(--envyron-light-teal)] text-pretty max-w-lg">
								Build once, reuse everywhere.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4">
							{/* <Button */}
							{/* 	size="lg" */}
							{/* 	className="bg-white text-[var(--envyron-navy)] hover:bg-[var(--envyron-light-teal)] hover:text-[var(--envyron-navy)] transition-all duration-300 font-semibold glow-on-hover hover:scale-105 transform" */}
							{/* > */}
							{/* 	<Github className="w-5 h-5 mr-2" /> */}
							{/* 	Sign in with GitHub */}
							{/* </Button> */}
							{/**/}
							{/* <Button */}
							{/* 	size="lg" */}
							{/* 	variant="outline" */}
							{/* 	className="border-[var(--envyron-light-teal)] text-[var(--envyron-light-teal)] hover:bg-[var(--envyron-light-teal)] hover:text-[var(--envyron-navy)] transition-all duration-300 font-semibold bg-transparent glow-on-hover hover:scale-105 transform" */}
							{/* > */}
							{/* 	<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"> */}
							{/* 		<path */}
							{/* 			fill="currentColor" */}
							{/* 			d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" */}
							{/* 		/> */}
							{/* 		<path */}
							{/* 			fill="currentColor" */}
							{/* 			d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" */}
							{/* 		/> */}
							{/* 		<path */}
							{/* 			fill="currentColor" */}
							{/* 			d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" */}
							{/* 		/> */}
							{/* 		<path */}
							{/* 			fill="currentColor" */}
							{/* 			d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" */}
							{/* 		/> */}
							{/* 	</svg> */}
							{/* 	Sign in with Google */}
							{/* </Button> */}

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
	)
}
