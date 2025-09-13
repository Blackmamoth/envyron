"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Settings, FileText, FolderOpen, MoreVertical, Edit, Trash2, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const mockProjects = [
	{ id: 1, name: "E-commerce API", description: "REST API for online store with payment integration" },
	{ id: 2, name: "Chat Application", description: "Real-time messaging app with WebSocket support" },
	{ id: 3, name: "Analytics Dashboard", description: "Data visualization platform for business metrics" },
]

const mockTemplates = [
	{ id: 1, name: "Next.js Starter", description: "Full-stack Next.js template with authentication" },
	{ id: 2, name: "Express API", description: "Node.js Express server with TypeScript setup" },
	{ id: 3, name: "React Component", description: "Reusable React component with Storybook" },
]

const mockServices = [
	{ id: 1, name: "PostgreSQL Database", description: "Production database configuration" },
	{ id: 2, name: "Redis Cache", description: "In-memory caching service setup" },
	{ id: 3, name: "AWS S3 Storage", description: "File storage service configuration" },
]

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState("projects")
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [newItemName, setNewItemName] = useState("")
	const [newItemDescription, setNewItemDescription] = useState("")
	const router = useRouter()

	const handleCreateNew = () => {
		if (!newItemName.trim()) return

		const params = new URLSearchParams({
			name: newItemName,
			...(newItemDescription && { description: newItemDescription }),
		})

		if (activeTab === "projects") {
			router.push(`/projects/workspace?${params}`)
		} else if (activeTab === "templates") {
			router.push(`/templates/builder?${params}`)
		}

		setNewItemName("")
		setNewItemDescription("")
		setIsCreateModalOpen(false)
	}

	const handleCreateClick = () => {
		if (activeTab === "services") {
			router.push("/services/editor")
		} else {
			setIsCreateModalOpen(true)
		}
	}

	const renderEmptyState = (type: string) => (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="w-16 h-16 rounded-full bg-[var(--envyron-teal)]/20 flex items-center justify-center mb-4">
				{type === "projects" && <FolderOpen className="w-8 h-8 text-[var(--envyron-light-teal)]" />}
				{type === "templates" && <FileText className="w-8 h-8 text-[var(--envyron-light-teal)]" />}
				{type === "services" && <Settings className="w-8 h-8 text-[var(--envyron-light-teal)]" />}
			</div>
			<h3 className="text-xl font-semibold text-white mb-2">No {type.charAt(0).toUpperCase() + type.slice(1)} yet</h3>
			<p className="text-[var(--envyron-light-teal)]/60 mb-6">Create your first {type.slice(0, -1)} to get started</p>
		</div>
	)

	const renderItemCards = (items: any[], type: string) => (
		<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{items.map((item) => (
				<Card
					key={item.id}
					className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 hover:border-[var(--envyron-light-teal)]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--envyron-light-teal)]/10"
				>
					<div className="p-6">
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-white mb-2 font-mono">{item.name}</h3>
								<p className="text-[var(--envyron-light-teal)]/70 text-sm leading-relaxed">{item.description}</p>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="text-[var(--envyron-light-teal)] hover:bg-[var(--envyron-teal)]/20"
									>
										<MoreVertical className="w-4 h-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="bg-[var(--envyron-navy)] border-[var(--envyron-teal)]/30">
									{type === "services" ? (
										<Link href="/services/editor">
											<DropdownMenuItem className="text-white hover:bg-[var(--envyron-teal)]/20">
												<Edit className="w-4 h-4 mr-2" />
												Edit
											</DropdownMenuItem>
										</Link>
									) : type === "templates" ? (
										<Link href="/templates/builder">
											<DropdownMenuItem className="text-white hover:bg-[var(--envyron-teal)]/20">
												<Edit className="w-4 h-4 mr-2" />
												Edit
											</DropdownMenuItem>
										</Link>
									) : (
										<Link href="/projects/workspace">
											<DropdownMenuItem className="text-white hover:bg-[var(--envyron-teal)]/20">
												<Edit className="w-4 h-4 mr-2" />
												Open Workspace
											</DropdownMenuItem>
										</Link>
									)}
									<DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
										<Trash2 className="w-4 h-4 mr-2" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</Card>
			))}
		</div>
	)

	return (
		<main className="min-h-screen">
			<header className="fixed top-0 left-0 right-0 z-50 bg-[var(--envyron-navy)]/95 backdrop-blur-sm border-b border-[var(--envyron-teal)]/20">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-[var(--envyron-teal)] rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">E</span>
							</div>
							<span className="text-white font-semibold text-xl">Envyron</span>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="w-8 h-8 rounded-full bg-[var(--envyron-teal)]/20 hover:bg-[var(--envyron-teal)]/30"
								>
									<User className="w-4 h-4 text-[var(--envyron-light-teal)]" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-[var(--envyron-navy)] border-[var(--envyron-teal)]/30">
								<DropdownMenuItem className="text-white hover:bg-[var(--envyron-teal)]/20">Sign Out</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			<div className="pt-20 pb-12 px-6">
				<div className="container mx-auto">
					<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
						<div className="flex items-center justify-between mb-8">
							<TabsList className="bg-[var(--envyron-navy)]/60 border border-[var(--envyron-teal)]/30">
								<TabsTrigger
									value="projects"
									className="data-[state=active]:bg-[var(--envyron-teal)] data-[state=active]:text-white text-[var(--envyron-light-teal)]"
								>
									Projects
								</TabsTrigger>
								<TabsTrigger
									value="templates"
									className="data-[state=active]:bg-[var(--envyron-teal)] data-[state=active]:text-white text-[var(--envyron-light-teal)]"
								>
									Templates
								</TabsTrigger>
								<TabsTrigger
									value="services"
									className="data-[state=active]:bg-[var(--envyron-teal)] data-[state=active]:text-white text-[var(--envyron-light-teal)]"
								>
									Services
								</TabsTrigger>
							</TabsList>

							<Button
								onClick={handleCreateClick}
								className="bg-[var(--envyron-teal)] hover:bg-[var(--envyron-light-teal)] text-white"
							>
								<Plus className="w-4 h-4 mr-2" />
								Create New
							</Button>
						</div>

						<TabsContent value="projects" className="mt-0">
							{mockProjects.length > 0 ? renderItemCards(mockProjects, "projects") : renderEmptyState("projects")}
						</TabsContent>

						<TabsContent value="templates" className="mt-0">
							{mockTemplates.length > 0 ? renderItemCards(mockTemplates, "templates") : renderEmptyState("templates")}
						</TabsContent>

						<TabsContent value="services" className="mt-0">
							{mockServices.length > 0 ? renderItemCards(mockServices, "services") : renderEmptyState("services")}
						</TabsContent>
					</Tabs>
				</div>
			</div>

			<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
				<DialogContent className="bg-[var(--envyron-navy)] border-[var(--envyron-teal)]/30 text-white">
					<DialogHeader>
						<DialogTitle>Create New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--envyron-light-teal)]">Name *</label>
							<Input
								value={newItemName}
								onChange={(e) => setNewItemName(e.target.value)}
								placeholder={`Enter ${activeTab.slice(0, -1)} name...`}
								className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 text-white placeholder:text-gray-500 focus:border-[var(--envyron-light-teal)]"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--envyron-light-teal)]">Description (optional)</label>
							<Textarea
								value={newItemDescription}
								onChange={(e) => setNewItemDescription(e.target.value)}
								placeholder={`Describe your ${activeTab.slice(0, -1)}...`}
								className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 text-white placeholder:text-gray-500 focus:border-[var(--envyron-light-teal)] resize-none"
								rows={3}
							/>
						</div>
						<div className="flex justify-end gap-3 pt-4">
							<Button
								variant="ghost"
								onClick={() => {
									setIsCreateModalOpen(false)
									setNewItemName("")
									setNewItemDescription("")
								}}
								className="text-gray-400 hover:text-white"
							>
								Cancel
							</Button>
							<Button
								onClick={handleCreateNew}
								disabled={!newItemName.trim()}
								className="bg-[var(--envyron-teal)] hover:bg-[var(--envyron-light-teal)] text-white"
							>
								Create
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</main>
	)
}
