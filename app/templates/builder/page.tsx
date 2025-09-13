"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, ChevronDown, ChevronRight, Save, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// Mock data for available services
const mockServices = [
	{
		id: "auth-service",
		name: "Authentication Service",
		description: "JWT-based authentication with user management",
		envVariables: [
			{ key: "JWT_SECRET", defaultValue: "your-secret-key", description: "Secret key for JWT token signing" },
			{ key: "TOKEN_EXPIRY", defaultValue: "24h", description: "Token expiration time" },
			{ key: "REFRESH_TOKEN_EXPIRY", defaultValue: "7d", description: "Refresh token expiration time" },
		],
	},
	{
		id: "database-service",
		name: "Database Service",
		description: "PostgreSQL database connection and migrations",
		envVariables: [
			{
				key: "DATABASE_URL",
				defaultValue: "postgresql://localhost:5432/mydb",
				description: "Database connection string",
			},
			{ key: "DB_POOL_SIZE", defaultValue: "10", description: "Maximum database connection pool size" },
			{ key: "DB_TIMEOUT", defaultValue: "30000", description: "Database query timeout in milliseconds" },
		],
	},
	{
		id: "email-service",
		name: "Email Service",
		description: "SMTP email sending with templates",
		envVariables: [
			{ key: "SMTP_HOST", defaultValue: "smtp.gmail.com", description: "SMTP server hostname" },
			{ key: "SMTP_PORT", defaultValue: "587", description: "SMTP server port" },
			{ key: "SMTP_USER", defaultValue: "your-email@gmail.com", description: "SMTP username" },
			{ key: "SMTP_PASS", defaultValue: "your-app-password", description: "SMTP password or app password" },
		],
	},
	{
		id: "redis-service",
		name: "Redis Cache",
		description: "Redis caching and session storage",
		envVariables: [
			{ key: "REDIS_URL", defaultValue: "redis://localhost:6379", description: "Redis connection string" },
			{ key: "REDIS_TTL", defaultValue: "3600", description: "Default cache TTL in seconds" },
		],
	},
	{
		id: "storage-service",
		name: "File Storage",
		description: "S3-compatible file storage service",
		envVariables: [
			{ key: "S3_BUCKET", defaultValue: "my-app-bucket", description: "S3 bucket name" },
			{ key: "S3_REGION", defaultValue: "us-east-1", description: "S3 region" },
			{ key: "S3_ACCESS_KEY", defaultValue: "your-access-key", description: "S3 access key ID" },
			{ key: "S3_SECRET_KEY", defaultValue: "your-secret-key", description: "S3 secret access key" },
		],
	},
	{
		id: "logging-service",
		name: "Logging Service",
		description: "Structured logging with multiple outputs",
		envVariables: [
			{ key: "LOG_LEVEL", defaultValue: "info", description: "Minimum log level (debug, info, warn, error)" },
			{ key: "LOG_FORMAT", defaultValue: "json", description: "Log output format (json, text)" },
		],
	},
]

export default function TemplateBuilder() {
	const searchParams = useSearchParams()
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedServices, setSelectedServices] = useState<string[]>([])
	const [expandedServices, setExpandedServices] = useState<string[]>([])
	const [templateName, setTemplateName] = useState("New Template")
	const [isEditingName, setIsEditingName] = useState(false)
	const [tempName, setTempName] = useState("")

	useEffect(() => {
		const name = searchParams.get("name")
		if (name) {
			setTemplateName(name)
			setTempName(name)
		}
	}, [searchParams])

	const filteredServices = mockServices.filter(
		(service) =>
			service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			service.description.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	const handleServiceToggle = (serviceId: string) => {
		setSelectedServices((prev) =>
			prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
		)
	}

	const toggleServiceExpansion = (serviceId: string) => {
		setExpandedServices((prev) =>
			prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
		)
	}

	const handleNameEdit = () => {
		setTempName(templateName)
		setIsEditingName(true)
	}

	const handleNameSave = () => {
		if (tempName.trim()) {
			setTemplateName(tempName.trim())
		}
		setIsEditingName(false)
	}

	const handleNameCancel = () => {
		setTempName(templateName)
		setIsEditingName(false)
	}

	const selectedServiceData = mockServices.filter((service) => selectedServices.includes(service.id))

	return (
		<div className="min-h-screen bg-[#0B1437] text-white">
			{/* Header */}
			<header className="border-b border-gray-800 bg-[#0B1437]/95 backdrop-blur-sm sticky top-0 z-10">
				<div className="px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/dashboard">
							<Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Dashboard
							</Button>
						</Link>
						<div className="flex items-center gap-2 group">
							{isEditingName ? (
								<div className="flex items-center gap-2">
									<Input
										value={tempName}
										onChange={(e) => setTempName(e.target.value)}
										className="bg-[#1a2951] border-gray-700 text-white text-xl font-semibold w-64"
										onKeyDown={(e) => {
											if (e.key === "Enter") handleNameSave()
											if (e.key === "Escape") handleNameCancel()
										}}
										autoFocus
									/>
									<Button size="sm" onClick={handleNameSave} className="bg-[#006D77] hover:bg-[#83C5BE]">
										Save
									</Button>
									<Button size="sm" variant="ghost" onClick={handleNameCancel} className="text-gray-400">
										Cancel
									</Button>
								</div>
							) : (
								<div className="flex items-center gap-2 cursor-pointer" onClick={handleNameEdit}>
									<h1 className="text-xl font-semibold">{templateName}</h1>
									<Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
							)}
						</div>
					</div>
					<Button
						className="bg-[#006D77] hover:bg-[#83C5BE] text-white transition-all duration-200"
						disabled={selectedServices.length === 0}
					>
						<Save className="w-4 h-4 mr-2" />
						Save Template
					</Button>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex h-[calc(100vh-73px)]">
				{/* Left Panel - Service Selector */}
				<div className="w-2/5 border-r border-gray-800 bg-[#0F1B4C]/50 p-6">
					<div className="mb-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								placeholder="Search services…"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 bg-[#1A2B5C] border-gray-700 text-white placeholder-gray-400 focus:border-[#006D77]"
							/>
						</div>
					</div>

					<div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
						{filteredServices.map((service) => (
							<div
								key={service.id}
								className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:border-[#006D77] hover:shadow-lg hover:shadow-[#006D77]/20 ${selectedServices.includes(service.id)
									? "bg-[#006D77]/15 border-[#006D77]"
									: "bg-[#1A2B5C] border-gray-700"
									}`}
								onClick={() => handleServiceToggle(service.id)}
							>
								<div className="flex items-start gap-3">
									<Checkbox
										checked={selectedServices.includes(service.id)}
										onChange={() => handleServiceToggle(service.id)}
										className="mt-1"
									/>
									<div className="flex-1">
										<h3 className="font-semibold text-white mb-1">{service.name}</h3>
										<p className="text-sm text-gray-400">{service.description}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Right Panel - Live Summary */}
				<div className="flex-1 p-6 bg-[#0B1437]">
					<div className="mb-6">
						<h2 className="text-lg font-semibold text-white">Template Preview</h2>
					</div>

					{selectedServiceData.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-center">
							<div className="w-16 h-16 bg-[#1A2B5C] rounded-lg flex items-center justify-center mb-4">
								<Search className="w-8 h-8 text-gray-400" />
							</div>
							<p className="text-gray-400 text-lg mb-2">No services selected yet</p>
							<p className="text-gray-500 text-sm">Start by choosing services on the left.</p>
						</div>
					) : (
						<div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
							{selectedServiceData.map((service) => (
								<div key={service.id} className="bg-[#1A2B5C] rounded-lg border border-gray-700">
									<div
										className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#1A2B5C]/80 transition-colors"
										onClick={() => toggleServiceExpansion(service.id)}
									>
										<div>
											<h3 className="font-semibold text-white">{service.name}</h3>
											<p className="text-sm text-gray-400">{service.description}</p>
										</div>
										{expandedServices.includes(service.id) ? (
											<ChevronDown className="w-5 h-5 text-gray-400" />
										) : (
											<ChevronRight className="w-5 h-5 text-gray-400" />
										)}
									</div>

									{expandedServices.includes(service.id) && (
										<div className="px-4 pb-4 border-t border-gray-700">
											<div className="mt-4">
												<h4 className="text-sm font-medium text-gray-300 mb-3">Environment Variables</h4>
												<div className="space-y-3">
													{service.envVariables.map((envVar, index) => (
														<div key={index} className="grid grid-cols-3 gap-4 text-sm">
															<div>
																<span className="font-mono text-[#83C5BE]">{envVar.key}</span>
															</div>
															<div>
																<span className="font-mono text-gray-300">{envVar.defaultValue}</span>
															</div>
															<div>
																<span className="text-gray-400">{envVar.description}</span>
															</div>
														</div>
													))}
												</div>
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Fixed Action Bar */}
			<div className="fixed bottom-0 left-0 right-0 bg-[#0B1437]/95 backdrop-blur-sm border-t border-gray-800 p-4">
				<div className="flex justify-between items-center max-w-7xl mx-auto">
					<Link href="/dashboard">
						<Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
							Cancel
						</Button>
					</Link>
					<Button
						className="bg-[#006D77] hover:bg-[#83C5BE] text-white transition-all duration-200 shadow-lg hover:shadow-[#006D77]/30"
						disabled={selectedServices.length === 0}
					>
						<Save className="w-4 h-4 mr-2" />
						Save Template
					</Button>
				</div>
			</div>
		</div>
	)
}
