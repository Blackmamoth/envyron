import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Copy, Download } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { EnvVariable, Service } from "@/db/schema";
import type { PreviewType } from "@/types";
import { DOWNLOAD_FILENAMES, PREVIEW_OPTIONS } from "@/lib/constants";
import { ConfigGenerator } from "@/lib/config";
import { generateConfig as generateEnvConfig } from "@/lib/config/env";

type Props = {
  enabledServices: string[];
  projectItems: Service[];
  serviceVariables: Record<string, EnvVariable[]>;
  variableConfigs: Record<
    string,
    Record<string, { included: boolean; required: boolean }>
  >;
};

const CopiedTooltip = ({ show }: { show: boolean }) =>
  show ? (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#006D77] text-white px-2 py-1 rounded text-xs whitespace-nowrap">
      Copied!
    </div>
  ) : null;

const LineNumbers = ({ content }: { content: string }) => {
  const lines = useMemo(() => content.split("\n"), [content]);

  return (
    <pre className="p-6 text-sm font-mono leading-relaxed h-full overflow-auto">
      <code className="text-gray-300">
        {lines.map((line, index) => {
          const lineKey = `line-${index + 1}-${line.slice(0, 20).replace(/\s/g, "_")}`;
          return (
            <div key={lineKey} className="flex">
              <span className="text-[#83C5BE] w-8 text-right mr-4 select-none shrink-0">
                {index + 1}
              </span>
              <span className="flex-1 break-all">{line || " "}</span>
            </div>
          );
        })}
      </code>
    </pre>
  );
};

const PreviewDropdown = ({
  activePreview,
  onPreviewChange,
}: {
  activePreview: PreviewType;
  onPreviewChange: (preview: PreviewType) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        className="bg-transparent border-gray-600 text-white hover:bg-[#006D77]/20"
        aria-label="Select preview type"
      >
        {activePreview}
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="bg-[#0B1437] border-gray-700">
      {PREVIEW_OPTIONS.map((option) => (
        <DropdownMenuItem
          key={option}
          onClick={() => onPreviewChange(option)}
          className="text-white hover:bg-[#006D77]/20 font-mono cursor-pointer"
        >
          {option}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export function ServiceManagerRightPanel({
  enabledServices,
  projectItems,
  serviceVariables,
  variableConfigs,
}: Props) {
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [activePreview, setActivePreview] = useState<PreviewType>(".env");

  const currentContent = useMemo(() => {
    if (enabledServices.length === 0) {
      return "# No services enabled\n# Toggle services in the sidebar to see configuration";
    }

    const generateContent = ConfigGenerator[activePreview] || generateEnvConfig;
    return generateContent(
      enabledServices,
      projectItems,
      serviceVariables,
      variableConfigs,
    );
  }, [
    enabledServices,
    projectItems,
    serviceVariables,
    variableConfigs,
    activePreview,
  ]);

  const handleCopyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(currentContent);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  }, [currentContent]);

  const handleDownloadFile = useCallback(() => {
    const filename = DOWNLOAD_FILENAMES[activePreview];

    try {
      const blob = new Blob([currentContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }, [currentContent, activePreview]);

  const handlePreviewChange = useCallback((preview: PreviewType) => {
    setActivePreview(preview);
  }, []);

  const hasEnabledServices = enabledServices.length > 0;

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0B1437]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <PreviewDropdown
              activePreview={activePreview}
              onPreviewChange={handlePreviewChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyToClipboard}
              disabled={!hasEnabledServices}
              className="border-gray-600 text-gray-300 hover:bg-[#006D77] hover:text-white relative bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Copy configuration to clipboard"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
              <CopiedTooltip show={copiedFeedback} />
            </Button>

            <Button
              size="sm"
              onClick={handleDownloadFile}
              disabled={!hasEnabledServices}
              className="bg-[#006D77] hover:bg-[#83C5BE] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Download ${DOWNLOAD_FILENAMES[activePreview]} file`}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Code Preview */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="bg-[#050A1C] rounded-lg border border-gray-800 h-full overflow-hidden">
          <LineNumbers content={currentContent} />
        </div>
      </div>
    </div>
  );
}
