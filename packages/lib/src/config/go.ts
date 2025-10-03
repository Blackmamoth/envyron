import type { EnumVariableTypes, EnvVariable, Service } from "@envyron/types";
import { toPascalCase } from "../utils";

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
      return "string";
    case "EMAIL":
      return "string";
    case "DURATION":
      return "string";
    case "FILEPATH":
      return "str";
    case "ARRAY":
      return "[]string";
    case "JSON":
      return "any";
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

  content +=
    'import (\n\t"log"\n\n\t"github.com/joho/godotenv"\n\t"github.com/kelseyhightower/envconfig"\n)\n\n';

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

  // content += "var (\n";
  //
  // servicesArr.forEach((serviceId) => {
  //   const service = projectItems.find((item) => item.id === serviceId);
  //   if (!service) return;
  //
  //   const serviceName = toPascalCase(service.name);
  //
  //   content += `\t${serviceName}Config\t${serviceName}Configuration\n`;
  // });
  //
  // content += ")\n\n";

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
          colIndex === row.length - 1
            ? ""
            : " ".repeat(colWidths[colIndex] - cell.length + 1);
        return cell + pad;
      })
      .join(""),
  );
}
