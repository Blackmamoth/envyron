"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { EditableText } from "./editable-text";

type Props = {
  projectId: string;
};

export function ProjectsHeader({ projectId }: Props) {
  return (
    <header className="border-b border-gray-800 bg-[#0B1437]/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2 group">
            <EditableText projectId={projectId} />
          </div>
        </div>
      </div>
    </header>
  );
}
