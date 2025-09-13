import { Github } from "lucide-react"

export function Footer() {
	return (
		<footer className="py-12 px-6 border-t border-[var(--envyron-teal)]/20">
			<div className="container mx-auto">
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
					<div className="text-[var(--envyron-light-teal)]/60">© 2025 Envyron. All rights reserved.</div>

					<div className="flex items-center gap-6">
						<a
							href="#"
							className="flex items-center gap-2 text-[var(--envyron-light-teal)]/80 hover:text-[var(--envyron-light-teal)] transition-colors duration-300"
						>
							<Github className="w-4 h-4" />
							<span className="text-sm">GitHub Repository</span>
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
