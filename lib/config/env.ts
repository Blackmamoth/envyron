import type { EnvVariable, Service } from "@/types";

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
