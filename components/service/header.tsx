'use client'

import Link from "next/link"
import { notFound } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getServiceQueryOptions } from "@/lib/queryOptions/service"
import { toast } from "sonner"
import { EditableText } from "../editable-text"
import { ArrowLeft } from "lucide-react"

type Props = {
  serviceId: string
}

export default function ServiceHeader({ serviceId }: Props) {
  const { data, isPending, isError, error } = useQuery(getServiceQueryOptions(serviceId))

  const service = data?.service

  if (isError) {
    toast.error(error.message)
  }

  if (!service && !isPending) {
    notFound()
  }

  return (
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
          <EditableText value={service?.name || ""} onSave={async (v: string) => { }} />
        </div>
      </div>
    </header>
  )
}
