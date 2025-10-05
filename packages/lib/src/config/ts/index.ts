import type { EnumVariableTypes, EnvVariable, Service } from "@envyron/types";
import { getVariableValueByType } from "../../utils";
import { DURATION_REGEX, FILEPATH_REGEX } from "../../constants";

export function getLanguageType(type: EnumVariableTypes): string {
  switch (type) {
    case "STRING":
      return "z.string()";
    case "INT":
      return "z.coerce.number().int()";
    case "FLOAT":
      return "z.coerce.number()";
    case "BOOLEAN":
      return 'z.enum(["true", "false"]).transform((val) => val === "true")';
    case "URL":
      return "z.url()";
    case "EMAIL":
      return "z.email()";
    case "DURATION":
      return `z.string().regex(/${DURATION_REGEX}/, "Invalid duration format. Use e.g. 30s, 5m, 2h, 7d.")`;
    case "FILEPATH":
      return `z.string()\n\t\t\t.regex(/${FILEPATH_REGEX}/, "Invalid file path format.")\n\t\t\t.refine(val => !val.includes(".."), "Path traversal not allowed")`;
    case "ARRAY":
      return "z.string().transform(val => val.split(',').map(s => s.trim()))";
    case "JSON":
      return `z.string().transform((val, ctx) => {
        \ttry {
        \t  return JSON.parse(val);
        \t} catch (error) {
        \t  ctx.addIssue("Invalid JSON string");
        \t}
      })`;
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

        const isRequired =
          variableConfigs[service.id]?.[variable.key]?.required ??
          variable.required;

        if (isIncluded) {
          content += `\t\t${variable.key}: ${getLanguageType(variable.type)}`;

          content += isRequired ? "" : ".optional()";

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
