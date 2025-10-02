import type { EnumVariableTypes } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toCamelCase(text: string): string {
  const words = text.split(/[\s_]+/);

  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("")
  );
}

export function toPascalCase(text: string): string {
  const words = text.split(/[\s_]+/);

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export function toSnakeCase(text: string): string {
  return text.split(/\s+/).join("_").toLowerCase();
}

export function getVariableValueByType(value: string, type: EnumVariableTypes) {
  switch (type) {
    case "INT":
      return parseInt(value, 10);
    case "FLOAT":
      return parseFloat(value);
    default:
      return `'${value}'`;
  }
}
