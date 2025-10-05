import type { EnumVariableTypes, EnvVariable, Service } from "@envyron/types";
import {
  getVariableValueByType,
  hasType,
  toPascalCase,
  toSnakeCase,
} from "../../utils";
import { customTypes } from "./customTypeStrings";

const imports = [
  "from typing import Any, Annotated",
  "from pydantic_settings import BaseSettings, SettingsConfigDict",
  "from pydantic import Field, HttpUrl, EmailStr, BeforeValidator, AfterValidator",
  "import json",
  "import re",
];

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
      return "EmailStr";
    case "DURATION":
      return "Duration";
    case "FILEPATH":
      return "str";
    case "ARRAY":
      return "CommaSeparatedList";
    case "JSON":
      return "JsonDict";
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

  content += `${imports.join("\n")}\n\n`;

  Object.keys(customTypes).forEach((key) => {
    const typedKey = key as keyof typeof customTypes;

    if (
      hasType(servicesArr, serviceVariables, variableConfigs, typedKey) &&
      customTypes[typedKey] !== ""
    ) {
      content += `${customTypes[typedKey]}`;
    }
  });

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

        const isRequired =
          variableConfigs[service.id]?.[variable.key]?.required ??
          variable.required;

        if (isIncluded) {
          content += `\t${variable.key}: `;

          const type = getLanguageType(variable.type);

          content += isRequired ? type : `${type} | None`;

          if (variable.defaultValue) {
            content += ` = ${getVariableValueByType(variable.defaultValue, variable.type)}`;
          } else if (!isRequired && !variable.defaultValue) {
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
