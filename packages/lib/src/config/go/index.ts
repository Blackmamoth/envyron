import type { EnumVariableTypes, EnvVariable, Service } from "@envyron/types";
import { hasType, toPascalCase } from "../../utils";
import { customTypes } from "./customTypeStrings";

const GO_STDLIB_IMPORTS = ["encoding/json", "fmt", "log", "regexp"];
const GO_EXTERNALLIB_IMPORTS = [
  "github.com/joho/godotenv",
  "github.com/kelseyhightower/envconfig",
];

function getLanguageType(type: EnumVariableTypes): string {
  switch (type) {
    case "STRING":
      return "string";
    case "INT":
      return "int";
    case "FLOAT":
      return "float64";
    case "BOOLEAN":
      return "bool";
    case "URL":
      return "URL";
    case "EMAIL":
      return "Email";
    case "DURATION":
      return "Duration";
    case "FILEPATH":
      return "Filepath";
    case "ARRAY":
      return "[]string";
    case "JSON":
      return "JSONMap";
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
  if (servicesArr.length === 0) return "";

  let content = "package config\n\n";

  content += "import (";

  GO_STDLIB_IMPORTS.forEach((lib) => {
    content += `\n\t"${lib}"`;
  });

  content += "\n";

  GO_EXTERNALLIB_IMPORTS.forEach((lib) => {
    content += `\n\t"${lib}"`;
  });

  content += "\n)\n\n";

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
    const service = projectItems.find((item) => item.id === serviceId);
    if (!service) return;

    const structLines: string[][] = [];

    const envVariables = serviceVariables[serviceId];
    if (envVariables && envVariables.length > 0) {
      envVariables.forEach((variable) => {
        const isIncluded =
          variableConfigs[service.id]?.[variable.key]?.included;

        const isRequired =
          variableConfigs[service.id]?.[variable.key]?.required ??
          variable.required;

        if (isIncluded) {
          const typeStr = getLanguageType(variable.type);
          let tagStr = `envconfig:"${variable.key}"`;

          if (isRequired) {
            tagStr += ' required:"true"';
          }

          if (variable.defaultValue) {
            tagStr += ` default:"${variable.defaultValue}"`;
          }

          structLines.push([variable.key, typeStr, `\`${tagStr}\``]);
        }
      });
    }

    const alignedStruct = alignColumns(structLines);

    content += `type ${toPascalCase(service.name)}Configuration struct {\n`;

    alignedStruct.forEach((line) => {
      content += `\t${line}\n`;
    });

    content += "}\n\n";
  });

  const varLines: string[][] = [];
  servicesArr.forEach((serviceId) => {
    const service = projectItems.find((item) => item.id === serviceId);
    if (!service) return;

    const serviceName = toPascalCase(service.name);
    varLines.push([`${serviceName}Config`, `${serviceName}Configuration`]);
  });

  const alignedVars = alignColumns(varLines);

  content += "var (\n";
  alignedVars.forEach((line) => {
    content += `\t${line}\n`;
  });
  content += ")\n\n";

  content += "func init() {\n\tloadEnv()\n}\n\n";

  content += "func loadEnv() {\n\tgodotenv.Load()\n\n";

  servicesArr.forEach((serviceId) => {
    const service = projectItems.find((item) => item.id === serviceId);
    if (!service) return;

    const serviceName = toPascalCase(service.name);

    content += `\tif err := envconfig.Process("", &${serviceName}Config); err != nil {\n`;
    content += `\t\tlog.Fatalf("An error occured while loading environment variables: %v", err)\n\t}\n\n`;
  });

  content += "}\n\n";

  return content.trim();
}

function alignColumns(rows: string[][]): string[] {
  if (rows.length === 0) return [];

  const colWidths: number[] = [];
  rows.forEach((row) => {
    row.forEach((cell, colIndex) => {
      colWidths[colIndex] = Math.max(colWidths[colIndex] || 0, cell.length);
    });
  });

  return rows.map((row) =>
    row
      .map((cell, colIndex) => {
        const pad =
          colIndex === row.length - 1 || colWidths[colIndex] === undefined
            ? ""
            : " ".repeat(colWidths[colIndex] - cell.length + 1);
        return cell + pad;
      })
      .join(""),
  );
}
