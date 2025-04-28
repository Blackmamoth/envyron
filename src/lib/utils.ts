import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { EnvVariable, Service } from "./store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: Date) {
  const distance = formatDistanceToNow(date, { addSuffix: true });
  return distance;
}

export const generateEnvContent = (
  services: Service[],
  activeServices: Record<string, boolean>,
) => {
  let content = "";
  if (services) {
    services.forEach((service) => {
      if (activeServices[service.id]) {
        content += `# ${service.name} Configuration\n`;
        service.variables.forEach((variable) => {
          content += `${variable.key}=\n`;
        });
        content += "\n";
      }
    });
  }
  return content.trim();
};

export const generatePythonCode = (
  serviceVars: Record<string, EnvVariable[]>,
) => {
  const services = Object.keys(serviceVars);
  let code = `
from pydantic_settings import BaseSettings, SettingsConfigDict

${services.map(
  (s) => `
class ${s}Schema(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)
    ${serviceVars[s].map(
      (v) => `
    ${v.key}: ${v.required ? "str" : "Optional[str]"} `,
    )}
`,
)}
`;

  code += `\n
${services.map(
  (s) => `
${s}Config = ${s}Schema()
`,
)}
`;

  return code.replaceAll(",", "");
};

export const generateJSCode = (serviceVars: Record<string, EnvVariable[]>) => {
  const services = Object.keys(serviceVars);

  let code = `
import { z } from 'zod'
import 'dotenv/config'


${services.map(
  (s) => `
const ${s}Schema = z.object({
${serviceVars[s].map(
  (v) => `   ${v.key}: z.string()${!v.required ? ".optional()" : ""},\n`,
)}
})
`,
)}
`;

  code += `
${services.map(
  (s) => `\n
export const ${s}Config = ${s}Schema.parse(process.env)
`,
)}
`;

  return code.replace(/^,/gm, "");
};

export const generateGolangCode = (
  serviceVars: Record<string, EnvVariable[]>,
) => {
  const services = Object.keys(serviceVars);

  let code = `
package config

import (
        "log"
        "os"

        "github.com/joho/godotenv"
        "github.com/kelseyhightower/envconfig"
)

${services.map(
  (s) => `
type ${s}Configuration struct {
${serviceVars[s].map(
  (v) =>
    `   ${v.key} string \`envconfig:"ENVIRONMENT" ${v.required ? 'required:"true"' : ""}\`\n`,
)}}
`,
)}
`;

  code += `
var (
${services.map(
  (s) => `    ${s}Config ${s}Configuration
`,
)})
`;

  code += `
func init() {
${services.map(
  (s) => `
    if err := envconfig.Process("", &${s}Config); err != nil {
      log.Fatalf("An error occured while loading environment variables: %v", err)
    }
`,
)}
}
`;

  return code.replace(/^,/gm, "").replace(/,$/gm, "");
};
