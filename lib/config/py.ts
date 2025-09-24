import type { EnumVariableTypes, EnvVariable, Service } from "@/db/schema";
import { getVariableValueByType, toPascalCase, toSnakeCase } from "../utils";

function getLanguageType(type: EnumVariableTypes): string {
  switch (type) {
    case "STRING":
      return "str";
    case "INT":
      return "int";
    case "FLOAT":
      return "float";
    case "BOOLEAN":
      return "bool";
    case "URL":
      return "HttpUrl";
    case "EMAIL":
      return "str";
    case "DURATION":
      return "str";
    case "FILEPATH":
      return "str";
    case "ARRAY":
      return "list[str]";
    case "JSON":
      return "Any";
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

  content +=
    "from typing import Optional\nfrom pydantic_settings import BaseSettings, SettingsConfigDict\nfrom pydantic import Field, HttpUrl, EmailStr\n\n";

  servicesArr.forEach((serviceId) => {
    const service = projectItems.find((s) => s.id === serviceId);
    if (!service) return;

    content += `class ${toPascalCase(service.name)}Config(BaseSettings):\n`;

    content +=
      "\tmodel_config = SettingsConfigDict(env_file='.env',case_sensitive=True,extra='ignore')\n\n";

    const envVars = serviceVariables[serviceId];

    if (envVars && envVars.length > 0) {
      envVars.forEach((variable) => {
        const isIncluded =
          variableConfigs[service.id]?.[variable.key]?.included;

        if (isIncluded) {
          content += `\t${variable.key}: `;

          const type = getLanguageType(variable.type);

          content += variable.required ? type : `Optional[${type}]`;

          if (variable.defaultValue) {
            content += ` = ${getVariableValueByType(variable.defaultValue, variable.type)}`;
          } else if (!variable.required) {
            content += ` = None`;
          }

          content += "\n";
        }
      });
    }

    content += "\n";
  });

  servicesArr.forEach((serviceId) => {
    const service = projectItems.find((s) => s.id === serviceId);
    if (!service) return;

    content += `${toSnakeCase(service.name)}_config = ${toPascalCase(service.name)}Config()\n`;
  });

  return content.trim();
}
