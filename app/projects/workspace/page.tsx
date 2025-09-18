"use client";

import {
  ArrowLeft,
  ChevronDown,
  Copy,
  Download,
  Edit2,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// Mock data for services and templates
const availableItems = [
  {
    id: 1,
    name: "PostgreSQL Database",
    type: "service",
    description: "Relational database with connection pooling",
  },
  {
    id: 2,
    name: "Redis Cache",
    type: "service",
    description: "In-memory data structure store",
  },
  {
    id: 3,
    name: "Auth Service",
    type: "service",
    description: "JWT-based authentication system",
  },
  {
    id: 4,
    name: "Email Service",
    type: "service",
    description: "SMTP email delivery service",
  },
  {
    id: 5,
    name: "Next.js Starter",
    type: "template",
    description: "Full-stack Next.js application template",
  },
  {
    id: 6,
    name: "API Gateway",
    type: "template",
    description: "Express.js API gateway with middleware",
  },
];

export default function ProjectWorkspace() {
  const searchParams = useSearchParams();
  const [activePreview, setActivePreview] = useState<
    ".env" | "TypeScript" | "Zod"
  >(".env");
  const [isTypeSafe, setIsTypeSafe] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [projectName, setProjectName] = useState("E-Commerce Platform");
  const [projectItems, setProjectItems] = useState([
    { id: 1, name: "PostgreSQL Database", type: "service", enabled: true },
    { id: 2, name: "Redis Cache", type: "service", enabled: true },
    { id: 3, name: "Auth Service", type: "service", enabled: false },
    { id: 5, name: "Next.js Starter", type: "template", enabled: true },
  ]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  const handleNameEdit = () => {
    setTempName(projectName);
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      setProjectName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(projectName);
    setIsEditingName(false);
  };

  useEffect(() => {
    const name = searchParams.get("name");
    if (name) {
      setProjectName(name);
    }
  }, [searchParams]);

  const filteredItems = availableItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !projectItems.some((projectItem) => projectItem.id === item.id),
  );

  const toggleItem = (id: number) => {
    setProjectItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };

  const addItem = (item: (typeof availableItems)[0]) => {
    setProjectItems((items) => [...items, { ...item, enabled: true }]);
    setAddModalOpen(false);
    setSearchQuery("");
  };

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

  const generateAndDownload = () => {
    const files = [
      { content: getCurrentContent(".env"), filename: ".env.example" },
      { content: getCurrentContent("TypeScript"), filename: "config.ts" },
      { content: getCurrentContent("Zod"), filename: "env.schema.ts" },
    ];

    files.forEach((file) => {
      const blob = new Blob([file.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const getCurrentContent = (previewType?: string) => {
    const enabledServices = projectItems.filter((item) => item.enabled);
    const preview = previewType || activePreview;

    if (enabledServices.length === 0) {
      return "# No services enabled\n# Toggle services in the sidebar to see configuration";
    }

    switch (preview) {
      case ".env":
        return generateEnvContent(enabledServices);
      case "TypeScript":
        return generateTypeScriptContent(enabledServices, isTypeSafe);
      case "Zod":
        return generateZodContent(enabledServices);
      default:
        return generateEnvContent(enabledServices);
    }
  };

  const generateEnvContent = (services: { name: string }[]) => {
    let content = "";
    services.forEach((service) => {
      if (service.name === "PostgreSQL Database") {
        content += `# Database Configuration\nDATABASE_URL="postgresql://user:password@localhost:5432/mydb"\nDATABASE_POOL_SIZE=10\n\n`;
      }
      if (service.name === "Redis Cache") {
        content += `# Redis Configuration\nREDIS_URL="redis://localhost:6379"\nREDIS_TTL=3600\n\n`;
      }
      if (service.name === "Auth Service") {
        content += `# Authentication\nJWT_SECRET="your-super-secret-jwt-key"\nJWT_EXPIRES_IN="7d"\n\n`;
      }
      if (service.name === "Email Service") {
        content += `# Email Service\nSMTP_HOST="smtp.gmail.com"\nSMTP_PORT=587\nSMTP_USER="your-email@gmail.com"\nSMTP_PASS="your-app-password"\n\n`;
      }
    });
    return content.trim();
  };

  const generateTypeScriptContent = (
    services: { name: string }[],
    typeSafe: boolean,
  ) => {
    let content = typeSafe ? `import { z } from 'zod'\n\n` : ``;
    services.forEach((service) => {
      if (service.name === "PostgreSQL Database") {
        content += `// Database configuration\nexport const dbConfig = {\n  url: process.env.DATABASE_URL!,\n  poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10'),\n}\n\n`;
      }
      if (service.name === "Redis Cache") {
        content += `// Redis configuration\nexport const redisConfig = {\n  url: process.env.REDIS_URL!,\n  ttl: parseInt(process.env.REDIS_TTL || '3600'),\n}\n\n`;
      }
      if (service.name === "Auth Service") {
        content += `// JWT configuration\nexport const jwtConfig = {\n  secret: process.env.JWT_SECRET!,\n  expiresIn: process.env.JWT_EXPIRES_IN || '7d',\n}\n\n`;
      }
    });
    return content.trim();
  };

  const generateZodContent = (services: { name: string }[]) => {
    let content = `import { z } from 'zod'\n\n// Environment variable schema\nexport const envSchema = z.object({\n`;
    services.forEach((service) => {
      if (service.name === "PostgreSQL Database") {
        content += `  // Database\n  DATABASE_URL: z.string().url(),\n  DATABASE_POOL_SIZE: z.coerce.number().min(1).max(100).default(10),\n  \n`;
      }
      if (service.name === "Redis Cache") {
        content += `  // Redis\n  REDIS_URL: z.string().url(),\n  REDIS_TTL: z.coerce.number().min(60).default(3600),\n  \n`;
      }
      if (service.name === "Auth Service") {
        content += `  // Authentication\n  JWT_SECRET: z.string().min(32),\n  JWT_EXPIRES_IN: z.string().default('7d'),\n  \n`;
      }
    });
    content += `})\n\n// Validate environment variables\nexport const env = envSchema.parse(process.env)`;
    return content;
  };

  return (
    <div className="min-h-screen bg-[#050A1C] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0B1437] px-6 py-4">
        <div className="flex items-center justify-between">
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
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-[#1a2951] border-gray-700 text-white text-xl font-semibold w-64"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNameSave();
                      if (e.key === "Escape") handleNameCancel();
                    }}
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleNameSave}
                    className="bg-[#006D77] hover:bg-[#83C5BE]"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleNameCancel}
                    className="text-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                < div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleNameEdit}
                >
                  <h1 className="text-xl font-semibold">{projectName}</h1>
                  <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={generateAndDownload}
            className="bg-[#006D77] hover:bg-[#83C5BE] text-white font-medium"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate & Download
          </Button>
        </div>
      </header >

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Service Manager */}
        <div className="w-80 bg-[#0B1437] border-r border-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Services & Templates</h2>

            {projectItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No services added yet.</p>
                <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#006D77] hover:bg-[#83C5BE] text-white">
                      Add your first service/template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0B1437] border-gray-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Add Service/Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search services and templates..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-[#050A1C] border-gray-600 text-white"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {filteredItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-[#050A1C] hover:bg-gray-800 transition-colors"
                          >
                            <div>
                              <h3 className="font-medium font-mono">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {item.description}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => addItem(item)}
                              className="bg-[#006D77] hover:bg-[#83C5BE] text-white"
                            >
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-3">
                {projectItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-[#006D77]/10 transition-colors group ${!item.enabled ? "opacity-50" : ""
                      }`}
                  >
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${item.type === "service" ? "font-mono" : ""}`}
                      >
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 capitalize">
                        {item.type}
                      </p>
                    </div>
                    <Switch
                      checked={item.enabled}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="data-[state=checked]:bg-[#006D77]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ... existing add button section ... */}
        </div>

        {/* Right Panel - Preview Panel */}
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
                    {[".env", "TypeScript", "Zod"].map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() =>
                          setActivePreview(
                            option as ".env" | "TypeScript" | "Zod",
                          )
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
                      <div key={line} className="flex">
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
      </div>
    </div >
  );
}
