import type { EnumVariableTypes, PreviewType } from "@envyron/types";

export const PREVIEW_OPTIONS: PreviewType[] = [
  ".env",
  "TypeScript",
  "Go",
  "Python",
];

export const VARIABLE_TYPES: EnumVariableTypes[] = [
  "STRING",
  "INT",
  "FLOAT",
  "BOOLEAN",
  "URL",
  "EMAIL",
  "DURATION",
  "FILEPATH",
  "ARRAY",
  "JSON",
];

export const DOWNLOAD_FILENAMES: Record<PreviewType, string> = {
  ".env": ".env.example",
  TypeScript: "config.ts",
  Go: "config.go",
  Python: "config.py",
};

export const DURATION_REGEX = "^\\d+(s|m|h|d)$";
export const FILEPATH_REGEX =
  '^([a-zA-Z]:\\\\|\\/)?([^<>:"|?*\\n]+[\\/\\\\])*[^<>:"|?*\\n]+$';
