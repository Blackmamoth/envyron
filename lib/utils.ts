import type { QueryClient } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getVariablesQueryOptions } from "./queryOptions/envVariable";
import type { SetStateAction } from "react";
import type { EnumVariableTypes, EnvVariable } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getServiceVariables(
  queryClient: QueryClient,
  serviceId: string,
  setServiceVariables: React.Dispatch<
    SetStateAction<Record<string, EnvVariable[]>>
  >,
) {
  try {
    const result = await queryClient.fetchQuery(
      getVariablesQueryOptions(serviceId),
    );
    setServiceVariables((prev) => ({
      ...prev,
      [serviceId]: result.variables,
    }));
  } catch (error) {
    console.error(error);
  }
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
