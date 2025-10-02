"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EditableText } from "./editable-text";

type Props = {
  serviceId: string;
};

export default function ServiceHeader({ serviceId }: Props) {
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
          <EditableText serviceId={serviceId} />
        </div>
      </div>
    </header>
  );
}
