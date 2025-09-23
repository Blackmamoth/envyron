import type { EnumVariableTypes, EnvVariable, Service } from "@/db/schema";
import { getVariableValueByType } from "../utils";

export function getLanguageType(type: EnumVariableTypes): string {
  switch (type) {
    case "STRING":
      return "z.string()";
    case "INT":
      return "z.coerce.number().int()";
    case "FLOAT":
      return "z.coerce.number()";
    case "BOOLEAN":
      return "z.coerce.boolean()";
    case "URL":
      return "z.url()";
    case "EMAIL":
      return "z.email()";
    case "DURATION":
      return "z.string()";
    case "FILEPATH":
      return "z.string()";
    case "ARRAY":
      return "z.array(z.string())";
    case "JSON":
      return "z.string().transform(val => JSON.parse(val))";
  }
}

export function generateConfig(
  servicesArr: string[],
  projectItems: Service[],
  serviceVariables: Record<string, EnvVariable[]>,
  variableConfigs: Record<
    string,
    Record<string, { included: boolean; required: boolean }>
  >,
) {
  let content = "";
  if (servicesArr.length === 0) return content;

  content += "import 'dotenv/config';\n";
  content += "import { createEnv } from '@t3-oss/env-core';\n";
  content += "import { z } from 'zod';\n\n";

  content += "export const env = createEnv({\n\tserver: {\n";

  servicesArr.forEach((serviceId) => {
    const service = projectItems.find((s) => s.id === serviceId);
    if (!service) return;

    content += `\n\t\t// ${service.name} Config\n`;

    const envVars = serviceVariables[serviceId];
    if (envVars && envVars.length > 0) {
      envVars.forEach((variable) => {
        const isIncluded =
          variableConfigs[service.id]?.[variable.key]?.included;

        if (isIncluded) {
          content += `\t\t${variable.key}: ${getLanguageType(variable.type)}`;

          content += variable.required ? "" : ".optional()";

          if (variable.defaultValue) {
            content += `.default(${getVariableValueByType(variable.defaultValue, variable.type)})`;
          }

          content += ",\n";
        }
      });
    }
  });

  content += "\t},\n\truntimeEnv: process.env,\n});";

  return content.trim();
}
