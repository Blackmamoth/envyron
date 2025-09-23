"use client";

import type { EnvVariable, Service } from "@/db/schema";
import { getServiceVariables } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { ServiceManagerLeftSidebar } from "./service-manager-left";
import { ServiceManagerRightPanel } from "./service-manager-right";
import { useFetchServices } from "@/hooks/use-service";
import { useFetchProjectComposition } from "@/hooks/use-project";

type Props = {
  projectId: string;
};

export function ServiceManager({ projectId }: Props) {
  const [projectItems, setProjectItems] = useState<Service[]>([]);
  const [enabledServices, setEnabledServices] = useState<string[]>([]);
  const [serviceVariables, setServiceVariables] = useState<
    Record<string, EnvVariable[]>
  >({});
  const [variableConfigs, setVariableConfigs] = useState<
    Record<string, Record<string, { included: boolean; required: boolean }>>
  >({});

  const queryClient = useQueryClient();

  const { services } = useFetchServices();

  const { compositions: projectCompositions } =
    useFetchProjectComposition(projectId);

  useEffect(() => {
    if (projectCompositions.length > 0 && services.length > 0) {
      const compositionServiceIds = projectCompositions.map(
        (comp) => comp.service,
      );

      const projectServices = services.filter((service) =>
        compositionServiceIds.includes(service.id),
      );

      const currentProjectServiceIds = projectItems.map((item) => item.id);
      const shouldUpdate =
        compositionServiceIds.some(
          (id) => !currentProjectServiceIds.includes(id),
        ) ||
        currentProjectServiceIds.some(
          (id) => !compositionServiceIds.includes(id),
        );

      if (shouldUpdate) {
        setProjectItems(projectServices);
        setEnabledServices(compositionServiceIds);

        projectServices.forEach(async (service) => {
          await getServiceVariables(
            queryClient,
            service.id,
            setServiceVariables,
          );
        });
      }
    }
  }, [projectCompositions, services, queryClient]);

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Left Sidebar - Service Manager */}
      <ServiceManagerLeftSidebar
        projectId={projectId}
        enabledServices={enabledServices}
        setEnabledServices={setEnabledServices}
        projectItems={projectItems}
        setProjectItems={setProjectItems}
        variableConfigs={variableConfigs}
        setVariableConfigs={setVariableConfigs}
        serviceVariables={serviceVariables}
        setServiceVariables={setServiceVariables}
      />

      {/* Right Panel - Preview Panel */}
      <ServiceManagerRightPanel
        enabledServices={enabledServices}
        projectItems={projectItems}
        serviceVariables={serviceVariables}
        variableConfigs={variableConfigs}
      />
    </div>
  );
}
