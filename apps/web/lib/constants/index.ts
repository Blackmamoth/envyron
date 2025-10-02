import type { PreviewType } from "@/types";

export const PREVIEW_OPTIONS: PreviewType[] = [
  ".env",
  "TypeScript",
  "Go",
  "Python",
];

export const DOWNLOAD_FILENAMES: Record<PreviewType, string> = {
  ".env": ".env.example",
  TypeScript: "config.ts",
  Go: "config.go",
  Python: "config.py",
};
