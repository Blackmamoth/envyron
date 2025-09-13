"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface EnvironmentVariable {
	id: string
	key: string
	defaultValue: string
	required: boolean
	type: string
}

export default function ServiceEditor() {
	const searchParams = useSearchParams()
	const [serviceName, setServiceName] = useState("")
	const [serviceDescription, setServiceDescription] = useState("")
	const [envVars, setEnvVars] = useState<EnvironmentVariable[]>([])
	const [isEditingName, setIsEditingName] = useState(false)
	const [tempName, setTempName] = useState("")

	useEffect(() => {
		const name = searchParams.get("name")
		const description = searchParams.get("description")
		if (name) {
			setServiceName(name)
			setTempName(name)
		}
		if (description) {
			setServiceDescription(description)
		}
	}, [searchParams])

	const addVariable = () => {
		const newVar: EnvironmentVariable = {
			id: Date.now().toString(),
			key: "",
			defaultValue: "",
			required: true,
			type: "string",
		}
		setEnvVars([...envVars, newVar])
	}

	const removeVariable = (id: string) => {
		setEnvVars(envVars.filter((v) => v.id !== id))
	}

	const updateVariable = (id: string, field: keyof EnvironmentVariable, value: string | boolean) => {
		setEnvVars(envVars.map((v) => (v.id === id ? { ...v, [field]: value } : v)))
	}

	const handleNameEdit = () => {
		setTempName(serviceName)
		setIsEditingName(true)
	}

	const handleNameSave = () => {
		if (tempName.trim()) {
			setServiceName(tempName.trim())
		}
		setIsEditingName(false)
	}

	const handleNameCancel = () => {
		setTempName(serviceName)
		setIsEditingName(false)
	}

	const isValid = serviceName.trim() && envVars.some((v) => v.key.trim())

	return (
		<div className="min-h-screen bg-[#0B1437] text-white">
			{/* Header */}
			<header className="border-b border-gray-800 bg-[#0B1437]/95 backdrop-blur-sm sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link
							href="/dashboard"
							className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Dashboard
						</Link>
						<div className="w-px h-6 bg-gray-700" />
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
									<h1 className="text-xl font-semibold">{serviceName || "New Service"}</h1>
									<Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
							)}
						</div>
					</div>
					<Button className="bg-[#006D77] hover:bg-[#83C5BE] text-white font-medium px-6" disabled={!isValid}>
						Save Service
					</Button>
				</div>
			</header>

			<div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
				{/* Service Info Section */}
				<section className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Service Name</label>
						<Input
							value={serviceName}
							onChange={(e) => setServiceName(e.target.value)}
							placeholder="Enter service name..."
							className="bg-[#1a2951] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#006D77] focus:ring-[#006D77] text-lg font-medium"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-400">Description (optional)</label>
						<Textarea
							value={serviceDescription}
							onChange={(e) => setServiceDescription(e.target.value)}
							placeholder="Describe what this service does..."
							className="bg-[#1a2951] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#006D77] focus:ring-[#006D77] resize-none"
							rows={3}
						/>
					</div>
				</section>

				{/* Environment Variables Section */}
				<section className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold text-white">Environment Variables</h2>
						<Button
							onClick={addVariable}
							variant="outline"
							className="border-[#006D77] text-[#006D77] hover:bg-[#006D77] hover:text-white transition-all duration-200 bg-transparent"
						>
							<Plus className="w-4 h-4 mr-2" />
							Add Variable
						</Button>
					</div>

					{envVars.length === 0 ? (
						<div className="text-center py-12 text-gray-500">
							<div className="text-lg mb-2">No variables yet</div>
							<div className="text-sm">Add your first environment variable to get started</div>
						</div>
					) : (
						<div className="space-y-4">
							{envVars.map((envVar, index) => (
								<div
									key={envVar.id}
									className="bg-[#1a2951] border border-gray-700 rounded-lg p-4 space-y-4 animate-in slide-in-from-top-2 duration-300"
									style={{ animationDelay: `${index * 50}ms` }}
								>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
										<div className="space-y-2">
											<label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Key *</label>
											<Input
												value={envVar.key}
												onChange={(e) => updateVariable(envVar.id, "key", e.target.value)}
												placeholder="API_KEY"
												className="bg-[#0B1437] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#006D77] focus:ring-[#006D77] font-mono"
											/>
										</div>

										<div className="space-y-2">
											<label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Default Value</label>
											<Input
												value={envVar.defaultValue}
												onChange={(e) => updateVariable(envVar.id, "defaultValue", e.target.value)}
												placeholder="your-api-key-here"
												className="bg-[#0B1437] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#006D77] focus:ring-[#006D77] font-mono"
											/>
										</div>

										<div className="space-y-2">
											<label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Required</label>
											<div className="flex items-center h-10">
												<Switch
													checked={envVar.required}
													onCheckedChange={(checked) => updateVariable(envVar.id, "required", checked)}
													className="data-[state=checked]:bg-[#006D77]"
												/>
												<span className="ml-2 text-sm text-gray-300">{envVar.required ? "Required" : "Optional"}</span>
											</div>
										</div>

										<div className="space-y-2">
											<label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Type</label>
											<div className="flex items-center gap-2">
												<Select value={envVar.type} onValueChange={(value) => updateVariable(envVar.id, "type", value)}>
													<SelectTrigger className="bg-[#0B1437] border-gray-600 text-white focus:border-[#006D77] focus:ring-[#006D77]">
														<SelectValue />
													</SelectTrigger>
													<SelectContent className="bg-[#0B1437] border-gray-700">
														<SelectItem value="string" className="text-white hover:bg-[#006D77]/20">
															string
														</SelectItem>
														<SelectItem value="number" className="text-white hover:bg-[#006D77]/20">
															number
														</SelectItem>
														<SelectItem value="boolean" className="text-white hover:bg-[#006D77]/20">
															boolean
														</SelectItem>
														<SelectItem value="JSON" className="text-white hover:bg-[#006D77]/20">
															JSON
														</SelectItem>
														<SelectItem value="URL" className="text-white hover:bg-[#006D77]/20">
															URL
														</SelectItem>
														<SelectItem value="email" className="text-white hover:bg-[#006D77]/20">
															email
														</SelectItem>
													</SelectContent>
												</Select>
												<Button
													onClick={() => removeVariable(envVar.id)}
													variant="ghost"
													size="sm"
													className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 flex-shrink-0"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</div>

			{/* Fixed Action Bar */}
			<div className="fixed bottom-0 left-0 right-0 bg-[#0B1437]/95 backdrop-blur-sm border-t border-gray-800">
				<div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
					<Link href="/dashboard">
						<Button variant="ghost" className="text-gray-400 hover:text-white">
							Cancel
						</Button>
					</Link>
					<Button
						className="bg-[#006D77] hover:bg-[#83C5BE] text-white font-medium px-8 shadow-lg hover:shadow-[#006D77]/25 transition-all duration-200"
						disabled={!isValid}
					>
						Save Service
					</Button>
				</div>
			</div>
		</div>
	)
}
