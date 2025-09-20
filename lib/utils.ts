import type { QueryClient } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getVariablesQueryOptions } from "./queryOptions/envVariable";
import type { SetStateAction } from "react";
import type { EnvVariable, Service } from "@/db/schema";

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

export function generateEnvContent(
  servicesArr: string[],
  projectItems: Service[],
  serviceVariables: Record<string, EnvVariable[]>,
  variableConfigs: Record<
    string,
    Record<string, { included: boolean; required: boolean }>
  >,
  typesafe: boolean,
) {
  console.log(typesafe);
  let content = "";
  if (servicesArr.length === 0) return content;

  servicesArr.forEach((serviceId) => {
    const service = projectItems.find((s) => s.id === serviceId);
    if (!service) return;

    content += `\n# ${service.name} CONFIGURATION\n`;

    const envVars = serviceVariables[serviceId];
    if (envVars && envVars.length > 0) {
      envVars.forEach((variable) => {
        const isIncluded =
          variableConfigs[service.id]?.[variable.key]?.included;

        if (isIncluded) {
          content += `${variable.key} = ${variable.defaultValue}\n`;
        }
      });
    }
  });
  return content.trim();
}

function generateTypeScriptContent(
  servicesArr: string[],
  projectItems: Service[],
  serviceVariables: Record<string, EnvVariable[]>,
  variableConfigs: Record<
    string,
    Record<string, { included: boolean; required: boolean }>
  >,
  typeSafe: boolean,
) {
  let content = "";
  if (servicesArr.length === 0) return content;

  content += "import 'dotenv/config'\n";

  content += typeSafe ? `import { z } from 'zod'\n\n` : "\n";

  servicesArr.forEach((serviceId) => {
    const service = projectItems.find((s) => s.id === serviceId);
    if (!service) return;

    content += `export const ${toCamelCase(service.name)}Config = {\n`;

    const envVars = serviceVariables[serviceId];
    if (envVars && envVars.length > 0) {
      envVars.forEach((variable) => {
        const isIncluded =
          variableConfigs[service.id]?.[variable.key]?.included;

        if (isIncluded) {
          content += `\t${variable.key}: process.env.${variable.key},\n`;
        }
      });
    }

    content += "};\n\n";
  });
  return content.trim();
}

export const contentGenerators: {
  [key: string]: (
    servicesArr: string[],
    projectItems: Service[],
    serviceVariables: Record<string, EnvVariable[]>,
    variableConfigs: Record<
      string,
      Record<string, { included: boolean; required: boolean }>
    >,
    typeSafe: boolean,
  ) => string;
} = {
  ".env": generateEnvContent,
  TypeScript: generateTypeScriptContent,
};
