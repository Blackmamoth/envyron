import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Copy, Download } from "lucide-react";
import { useState } from "react";
import { contentGenerators, generateEnvContent } from "@/lib/utils";
import type { EnvVariable, Service } from "@/db/schema";

type Props = {
  enabledServices: string[];
  projectItems: Service[];
  serviceVariables: Record<string, EnvVariable[]>;
  variableConfigs: Record<
    string,
    Record<string, { included: boolean; required: boolean }>
  >;
};

export function ServiceManagerRightPanel({
  enabledServices,
  projectItems,
  serviceVariables,
  variableConfigs,
}: Props) {
  const [isTypeSafe, setIsTypeSafe] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [activePreview, setActivePreview] = useState<".env" | "TypeScript">(
    ".env",
  );

  const copyToClipboard = () => {
    const content = getCurrentContent();
    navigator.clipboard.writeText(content);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  const downloadFile = () => {
    const content = getCurrentContent();
    const filename =
      activePreview === ".env"
        ? ".env.example"
        : activePreview === "TypeScript"
          ? "config.ts"
          : "env.schema.ts";

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCurrentContent = (previewType?: string) => {
    const preview = previewType || activePreview;

    if (enabledServices.length === 0) {
      return "# No services enabled\n# Toggle services in the sidebar to see configuration";
    }

    const generateContent = contentGenerators[preview] || generateEnvContent;

    return generateContent(
      enabledServices,
      projectItems,
      serviceVariables,
      variableConfigs,
      isTypeSafe,
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-800 bg-[#0B1437]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-transparent border-gray-600 text-white hover:bg-[#006D77]/20"
                >
                  {activePreview}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0B1437] border-gray-700">
                {[".env", "TypeScript"].map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() =>
                      setActivePreview(option as ".env" | "TypeScript")
                    }
                    className="text-white hover:bg-[#006D77]/20 font-mono"
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <Switch
                checked={isTypeSafe}
                onCheckedChange={setIsTypeSafe}
                className="data-[state=checked]:bg-[#006D77]"
              />
              <span className="text-sm text-gray-300">Type Safe</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={copyToClipboard}
              className="border-gray-600 text-gray-300 hover:bg-[#006D77] hover:text-white relative bg-transparent"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
              {copiedFeedback && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#006D77] text-white px-2 py-1 rounded text-xs">
                  Copied!
                </div>
              )}
            </Button>
            <Button
              size="sm"
              onClick={downloadFile}
              className="bg-[#006D77] hover:bg-[#83C5BE] text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Code Preview */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-[#050A1C] rounded-lg border border-gray-800 h-full">
          <pre className="p-6 text-sm font-mono leading-relaxed h-full overflow-auto">
            <code className="text-gray-300">
              {getCurrentContent()
                .split("\n")
                .map((line, index) => (
                  <div key={index} className="flex">
                    <span className="text-[#83C5BE] w-8 text-right mr-4 select-none">
                      {index + 1}
                    </span>
                    <span className="flex-1">{line}</span>
                  </div>
                ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
