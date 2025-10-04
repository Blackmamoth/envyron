import type { EnumVariableTypes, EnvVariable, Service } from "@envyron/types";
import { toPascalCase } from "../utils";
import { DURATION_REGEX, FILEPATH_REGEX } from "../constants";

const GO_STDLIB_IMPORTS = ["encoding/json", "fmt", "log", "regexp"];
const GO_EXTERNALLIB_IMPORTS = [
  "github.com/joho/godotenv",
  "github.com/kelseyhightower/envconfig",
];

const JSONMapType = `type JSONMap map[string]any

func (j *JSONMap) Decode(value string) error {
	return json.Unmarshal([]byte(value), j)
}\n\n`;

const EmailType = `type Email string

func (e *Email) Decode(value string) error {
	emailRegex := regexp.MustCompile(\`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$\`)
	if !emailRegex.MatchString(value) {
		return fmt.Errorf("invalid email format: %s", value)
	}
	*e = Email(value)
	return nil
}\n\n`;

const URLType = `type URL string

func (u *URL) Decode(value string) error {
	urlRegex := regexp.MustCompile("(?i)^https?://[^\s/$.?#].[^\s]*$")
	if !urlRegex.MatchString(value) {
		return fmt.Errorf("invalid URL format: %s", value)
	}
	*u = URL(value)
	return nil
}
`;

const DurationType = `type Duration string

func (d *Duration) Decode(value string) error {
	durationRegex := regexp.MustCompile(\`${DURATION_REGEX}\`)
	if !durationRegex.MatchString(value) {
		return fmt.Errorf("invalid Duration format: %s. Use e.g. 30s, 5m, 2h, 7d.", value)
	}
	*d = Duration(value)
	return nil
}\n\n`;

const FilepathType = `type Filepath string

func (f *Filepath) Decode(value string) error {
	filepathRegex := regexp.MustCompile(\`${FILEPATH_REGEX}\`)
	if !filepathRegex.MatchString(value) {
		return fmt.Errorf("invalid file path format: %s", value)
	}
	*f = Duration(value)
	return nil
}\n\n`;

const customTypes: { [key in EnumVariableTypes]: string } = {
  STRING: "",
  INT: "",
  FLOAT: "",
  BOOLEAN: "",
  URL: URLType,
  EMAIL: EmailType,
  DURATION: DurationType,
  FILEPATH: FilepathType,
  ARRAY: "",
  JSON: JSONMapType,
};

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

const hasType = (
  serviceArr: string[],
  serviceVariables: Record<string, EnvVariable[]>,
  variableConfigs: Record<
    string,
    Record<string, { included: boolean; required: boolean }>
  >,
  type: EnumVariableTypes,
) => {
  return serviceArr.some((serviceId) => {
    const envVariables = serviceVariables[serviceId];
    if (!envVariables) return false;

    return envVariables.some((variable) => {
      const isIncluded = variableConfigs[serviceId]?.[variable.key]?.included;
      return isIncluded && variable.type === type;
    });
  });
};

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
          colIndex === row.length - 1
            ? ""
            : " ".repeat(colWidths[colIndex] - cell.length + 1);
        return cell + pad;
      })
      .join(""),
  );
}
