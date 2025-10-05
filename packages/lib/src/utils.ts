import type { EnumVariableTypes, EnvVariable } from "@envyron/types";

export function toCamelCase(text: string): string {
  if (text.length === 0) return text;

  const words = text.split(/[\s_]+/);

  return (
    words[0]?.toLowerCase() +
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

export function hasType(
  serviceArr: string[],
  serviceVariables: Record<string, EnvVariable[]>,
  variableConfigs: Record<
    string,
    Record<string, { included: boolean; required: boolean }>
  >,
  type: EnumVariableTypes,
) {
  return serviceArr.some((serviceId) => {
    const envVariables = serviceVariables[serviceId];
    if (!envVariables) return false;

    return envVariables.some((variable) => {
      const isIncluded = variableConfigs[serviceId]?.[variable.key]?.included;
      return isIncluded && variable.type === type;
    });
  });
}
